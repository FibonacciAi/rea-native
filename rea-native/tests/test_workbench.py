import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
loader = importlib.util.spec_from_file_location('workbench', ROOT / 'server/workbench.py')
w = importlib.util.module_from_spec(loader)
loader.loader.exec_module(w)


class WorkbenchTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()

    def test_routes_remote_targets_without_network(self):
        for s, kind in [('https://github.com/morluto/rea', 'git-repository'),
                        ('https://example.org', 'website'), ('npm:@scope/pkg@1.2.3', 'npm-package'),
                        ('https://www.npmjs.com/package/rea-agents', 'npm-package')]:
            self.assertEqual(w.route_target(s)['kind'], kind)
            self.assertFalse(w.route_target(s)['policy']['execute_target'])

    def test_local_magic_and_package_routes(self):
        for name, raw, kind in [('sample.bin', b'\x7fELF\x00', 'native-or-managed-binary'),
                               ('sample.wasm', b'\x00asm\x01', 'wasm'),
                               ('sample.asar', b'\x00', 'electron-asar'),
                               ('sample.zip', b'PK', 'package-archive')]:
            p = self.root / name
            p.write_bytes(raw)
            self.assertEqual(w.route_target(str(p))['kind'], kind)
        (self.root / 'package.json').write_text('{"name":"fixture"}')
        self.assertEqual(w.route_target(str(self.root))['kind'], 'javascript-application')

    def test_rejects_credential_urls_and_unsupported_schemes(self):
        for target in ['https://name:password@example.org', 'http://example.org',
                       'file:///etc/passwd', 'https://example.org?token=secret',
                       'npm:pkg;touch /tmp/example', 'relative/path', '']:
            with self.subTest(target=target), self.assertRaises(ValueError):
                w.route_target(target)

    def test_bounded_inventory_excludes_sensitive_files_and_symlinks(self):
        (self.root / 'main.js').write_text('export const value = 7;')
        (self.root / '.env').write_text('TOKEN=synthetic-secret')
        (self.root / 'key.pem').write_text('synthetic-secret')
        (self.root / 'linked.js').symlink_to(self.root / '.env')
        (self.root / 'node_modules').mkdir()
        (self.root / 'node_modules/hidden.js').write_text('not inventoried')
        data = w.inspect_local(str(self.root))
        self.assertEqual([r['path'] for r in data['records']], ['main.js'])
        self.assertNotIn('synthetic-secret', json.dumps(data))
        self.assertNotIn('export const', json.dumps(data))
        self.assertTrue(data['records'][0]['complete_file'])
        with self.assertRaises(ValueError):
            w.inspect_local(str(self.root / 'linked.js'))

    def test_partial_bytes_and_file_limit_do_not_claim_complete(self):
        (self.root / 'large.js').write_bytes(b'x' * (w.MAX_BYTES + 1))
        data = w.inspect_local(str(self.root))
        self.assertFalse(data['records'][0]['complete_file'])
        self.assertFalse(data['coverage']['complete_repository'])
        for i in range(w.MAX_FILES + 1):
            (self.root / f'{i:04}.txt').write_text('x')
        data = w.inspect_local(str(self.root))
        self.assertEqual(len(data['records']), w.MAX_FILES)
        self.assertTrue(data['coverage']['truncated'])

    def test_special_file_refused(self):
        import os
        os.mkfifo(self.root / 'pipe')
        with self.assertRaises(ValueError):
            w.route_target(str(self.root / 'pipe'))

    def sample_spec(self):
        p = self.root / 'calculator.py'
        p.write_text('def add(a, b):\n    return a + b\n')
        e = [{'id': 'e1', 'state': 'source-derived', 'locator': 'calculator.py:1',
              'summary': 'add returns a+b; runtime not observed'}]
        f = [{'id': 'add', 'name': 'Addition', 'interface': 'add(a: number, b: number) -> number',
              'behavior': 'returns numeric sum', 'test': 'add(2,3) equals 5; add(-2,2) equals 0',
              'state': 'source-derived', 'evidence_ids': ['e1']}]
        return str(p), e, f

    def test_spec_handoff_and_parity_remain_finite(self):
        target, evidence, features = self.sample_spec()
        result = w.prepare_build(target, evidence, features)
        self.assertEqual(result['specification']['parity']['state'], 'unmeasured')
        self.assertIn('current native Codex session', result['handoff']['mechanism'])
        self.assertEqual(w.assess_parity(result['specification'], [])['counts']['not-run'], 1)
        r = w.assess_parity(result['specification'], [{'feature_id': 'add', 'status': 'passed',
                           'test_evidence': 'test.log:4', 'original_evidence': 'original.log:3',
                           'original_evidence_state': 'observed-runtime'}])
        self.assertEqual(r['measured_pass_fraction'], 1)
        self.assertEqual(r['global_parity'], 'unknown')

    def test_no_fabricated_or_unlinked_observations(self):
        target, evidence, features = self.sample_spec()
        features[0]['state'] = 'observed-runtime'
        with self.assertRaises(ValueError):
            w.prepare_build(target, evidence, features)
        features[0]['state'] = 'source-derived'
        features[0]['evidence_ids'] = ['nonexistent']
        with self.assertRaises(ValueError):
            w.prepare_build(target, evidence, features)

    def test_parity_requires_original_and_test_evidence(self):
        target, evidence, features = self.sample_spec()
        spec = w.prepare_build(target, evidence, features)['specification']
        for r in [{'feature_id': 'add', 'status': 'passed'},
                  {'feature_id': 'add', 'status': 'passed', 'test_evidence': 'test.log'},
                  {'feature_id': 'add', 'status': 'passed', 'test_evidence': 'test.log',
                   'original_evidence': 'static source only', 'original_evidence_state': 'source-derived'},
                  {'feature_id': 'other', 'status': 'passed'}]:
            with self.assertRaises(ValueError):
                w.assess_parity(spec, [r])

    def test_mcp_process_roundtrip_and_recovery(self):
        messages = [{'jsonrpc': '2.0', 'id': 1, 'method': 'initialize', 'params': {'protocolVersion': '2025-06-18'}},
                    {'jsonrpc': '2.0', 'method': 'notifications/initialized'},
                    {'jsonrpc': '2.0', 'id': 2, 'method': 'tools/list'},
                    {'jsonrpc': '2.0', 'id': 3, 'method': 'tools/call', 'params': {'name': 'route_target', 'arguments': {'target': 'https://example.org'}}},
                    {'jsonrpc': '2.0', 'id': 4, 'method': 'tools/call', 'params': {'name': 'route_target', 'arguments': {'target': 'http://bad'}}},
                    {'jsonrpc': '2.0', 'id': 5, 'method': 'ping'}]
        process = subprocess.run([sys.executable, str(ROOT / 'server/workbench.py')],
                   input='\n'.join(json.dumps(x) for x in messages) + '\n', text=True,
                   capture_output=True, timeout=10, check=True)
        rows = [json.loads(x) for x in process.stdout.splitlines()]
        self.assertEqual(len(rows), 5)
        self.assertEqual(len(rows[1]['result']['tools']), 4)
        self.assertEqual(rows[2]['result']['structuredContent']['kind'], 'website')
        self.assertTrue(rows[3]['result']['isError'])
        self.assertEqual(rows[4]['result'], {})
        self.assertEqual(process.stderr, '')
        for t in rows[1]['result']['tools']:
            self.assertEqual(t['annotations'], {'readOnlyHint': True, 'destructiveHint': False, 'openWorldHint': False})

    def test_engine_launcher_refuses_unapproved_runtime(self):
        import os
        p = subprocess.run([sys.executable, str(ROOT / 'scripts/launch_rea.py')],
                           env={**os.environ, 'REA_NATIVE_DATA': str(self.root / 'absent')},
                           text=True, capture_output=True, timeout=10)
        self.assertEqual(p.returncode, 78)
        self.assertIn('setup pending', p.stderr)
        self.assertEqual(p.stdout, '')


if __name__ == '__main__':
    unittest.main()
