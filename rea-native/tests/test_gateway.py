import asyncio
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'server'))
import gateway as g


# Authored inert protocol peer, not the target application or third-party code.
PEER = '''import json,sys
waiting=None
for line in sys.stdin:
 r=json.loads(line)
 if 'method' not in r:
  print(json.dumps({'jsonrpc':'2.0','id':waiting,'result':{'content':[{'type':'text','text':str(r.get('result'))}]}}),flush=True);continue
 m=r['method'];p=r.get('params',{});v={}
 if 'id' not in r:continue
 if m=='fail':
  print(json.dumps({'jsonrpc':'2.0','id':r['id'],'error':{'code':-32601,'message':'authored error'}}),flush=True);continue
 if m=='initialize':v={'protocolVersion':'2025-06-18','capabilities':{'tools':{},'resources':{}},'serverInfo':{'name':'authored-peer','version':'test-only'}}
 elif m=='tools/list':v={'tools':[{'name':'analyze_javascript_application','description':'Authored test schema','inputSchema':{'type':'object','properties':{'x':{'type':'array','items':{'type':'object'}}}}}]}
 elif m=='resources/list':v={'resources':[{'uri':'test:resource','name':'test'}]}
 elif m=='tools/call':
  if p.get('name')=='ask_host':
   waiting=r['id']
   print(json.dumps({'jsonrpc':'2.0','id':'engine-question','method':'roots/list','params':{}}),flush=True);continue
  print(json.dumps({'jsonrpc':'2.0','method':'notifications/message','params':{'level':'info','data':'test-only'}}),flush=True)
  v={'content':[{'type':'text','text':'untouched'}],'structuredContent':{'test':True,'evidence_id':'ev_authored_protocol_fixture'},'isError':False}
 print(json.dumps({'jsonrpc':'2.0','id':r['id'],'result':v}),flush=True)
'''


class GatewayTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        peer = Path(self.temp.name) / 'peer.py'
        peer.write_text(PEER)
        self.gateway = g.Gateway([sys.executable, str(peer)])
        self.messages = []
        self.gateway.emit = self.messages.append
        self.addAsyncCleanup(self.gateway.close)

    async def initialize(self):
        return await self.gateway.dispatch({'jsonrpc': '2.0', 'id': 1,
            'method': 'initialize', 'params': {'protocolVersion': '2025-06-18',
                'clientInfo': {'name': 'authored-test', 'version': '1'}, 'capabilities': {'roots': {}}}})

    async def test_one_endpoint_preserves_engine_catalog_and_exposes_workbench(self):
        init = await self.initialize()
        self.assertIn('resources', init['capabilities'])
        self.assertIn(str(ROOT / 'skills/rebuild-with-rea/SKILL.md'), init['instructions'])
        listed = await self.gateway.dispatch({'id': 2, 'method': 'tools/list'})
        self.assertEqual([t['name'] for t in listed['tools'][:6]],
            ['a_rebuild', 'plugin_status', 'route_target', 'inspect_local', 'prepare_build', 'assess_parity'])
        self.assertEqual(listed['tools'][6]['inputSchema']['properties']['x']['items'], {'type': 'object'})
        status = self.gateway.status()
        self.assertTrue(Path(status['skill_path']).is_file())
        self.assertTrue(status['engine']['connected'])
        self.assertEqual(status['engine']['tool_count'], 1)
        route = await self.gateway.dispatch({'id': 3, 'method': 'tools/call',
            'params': {'name': 'route_target', 'arguments': {'target': 'https://example.org'}}})
        self.assertEqual(route['structuredContent']['kind'], 'website')

    async def test_upstream_result_resources_notifications_and_errors_preserved(self):
        await self.initialize()
        response = await self.gateway.dispatch({'id': 3, 'method': 'tools/call',
            'params': {'name': 'analyze_javascript_application', 'arguments': {}}})
        self.assertEqual(response['result'], {'content': [{'type': 'text', 'text': 'untouched'}],
            'structuredContent': {'test': True, 'evidence_id': 'ev_authored_protocol_fixture'}, 'isError': False})
        self.assertEqual(self.messages[0]['method'], 'notifications/message')
        resources = await self.gateway.dispatch({'id': 4, 'method': 'resources/list'})
        self.assertEqual(resources['result']['resources'][0]['uri'], 'test:resource')
        error = await self.gateway.dispatch({'id': 5, 'method': 'fail'})
        self.assertEqual(error['error'], {'code': -32601, 'message': 'authored error'})

    async def test_engine_requests_are_relayed_to_host_without_self_approval(self):
        await self.initialize()
        task = asyncio.create_task(self.gateway.dispatch({'id': 7, 'method': 'tools/call',
            'params': {'name': 'ask_host', 'arguments': {}}}))
        for _ in range(100):
            if self.messages:
                break
            await asyncio.sleep(0.01)
        question = self.messages[-1]
        self.assertEqual(question['method'], 'roots/list')
        self.assertNotEqual(question['id'], 'engine-question')
        self.assertFalse(task.done())
        await self.gateway.receive({'jsonrpc': '2.0', 'id': question['id'], 'result': {'roots': []}})
        response = await asyncio.wait_for(task, timeout=2)
        self.assertEqual(response['result']['content'][0]['text'], "{'roots': []}")
        self.assertFalse(self.gateway.engine_requests)

    async def test_missing_engine_keeps_safe_workbench_and_reports_setup(self):
        await self.gateway.close()
        self.gateway = g.Gateway([sys.executable, '-c', 'raise SystemExit(78)'])
        init = await self.initialize()
        self.assertIn('unavailable', init['instructions'])
        listed = await self.gateway.dispatch({'id': 2, 'method': 'tools/list'})
        self.assertEqual(len(listed['tools']), 6)
        error = await self.gateway.dispatch({'id': 3, 'method': 'tools/call',
            'params': {'name': 'analyze_javascript_application', 'arguments': {}}})
        self.assertTrue(error['isError'])
        self.assertFalse(self.gateway.status()['engine']['connected'])

    async def test_disconnected_engine_is_not_reported_ready_and_local_tools_survive(self):
        await self.initialize()
        self.gateway.engine.terminate()
        await self.gateway.engine.wait()
        await self.gateway.reader_task
        self.assertFalse(self.gateway.status()['engine']['connected'])
        listed = await self.gateway.dispatch({'id': 2, 'method': 'tools/list'})
        self.assertEqual(len(listed['tools']), 6)
        with self.assertRaises(ValueError):
            await self.gateway.dispatch({'id': 3, 'method': 'tools/call', 'params': []})

    async def test_visible_workflow_entry_validates_and_dispatches_complete_accounting(self):
        await self.initialize()
        target = Path(self.temp.name).resolve() / 'owned.js'
        target.write_text('export const value = 1;')
        async def action(name, **args):
            return await self.gateway.dispatch({'id': 8, 'method': 'tools/call',
                'params': {'name': 'a_rebuild', 'arguments': {'action': name, **args}}})
        status = await action('plugin_status')
        self.assertTrue(Path(status['structuredContent']['skill_path']).is_file())
        route = await action('route_target', target=str(target))
        self.assertEqual(route['structuredContent']['kind'], 'source-file')
        inspected = await action('inspect_local', target=str(target))
        self.assertEqual(len(inspected['structuredContent']['records']), 1)
        e = [{'id': 'static1', 'state': 'source-derived', 'locator': 'owned.js:1', 'summary': 'Value is 1 in source'}]
        f = [{'id': 'value', 'name': 'Value', 'interface': 'value: number', 'behavior': 'returns 1',
            'test': 'assert value == 1', 'state': 'source-derived', 'evidence_ids': ['static1']}]
        prepared = await action('prepare_build', target=str(target), evidence=e, features=f)
        spec = prepared['structuredContent']['specification']
        parity = await action('assess_parity', specification=spec, results=[{'feature_id': 'value',
            'status': 'blocked', 'reason': 'Original execution prohibited; implementation tests alone are not runtime parity.'}])
        self.assertEqual(parity['structuredContent']['counts']['blocked'], 1)
        invalid = await action('route_target', target=str(target), results=[])
        self.assertTrue(invalid['isError'])

    async def test_js_artifact_handoff_requires_evidence_returned_by_connected_engine(self):
        await self.initialize()
        target = Path(self.temp.name).resolve()
        (target / 'package.json').write_text('{"name":"authored-protocol-fixture"}')
        args = {'target': str(target),
            'evidence': [{'id': 'invented', 'state': 'observed-static', 'locator': 'not-an-engine-result', 'summary': 'Unknown'}],
            'features': [{'id': 'x', 'name': 'X', 'interface': 'x()', 'behavior': 'Unknown',
                'test': 'not run', 'state': 'unknown', 'evidence_ids': ['invented']}]}
        request = {'id': 6, 'method': 'tools/call', 'params': {'name': 'prepare_build', 'arguments': args}}
        rejected = await self.gateway.dispatch(request)
        self.assertTrue(rejected['isError'])
        await self.gateway.dispatch({'id': 7, 'method': 'tools/call',
            'params': {'name': 'analyze_javascript_application', 'arguments': {}}})
        args['evidence'][0]['id'] = 'ev_authored_protocol_fixture'
        args['features'][0]['evidence_ids'] = ['ev_authored_protocol_fixture']
        accepted = await self.gateway.dispatch(request)
        self.assertIn('specification', accepted['structuredContent'])


if __name__ == '__main__':
    unittest.main()
