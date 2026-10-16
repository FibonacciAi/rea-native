#!/usr/bin/env python3
"""Validate the actual package or archive; never execute vendored code."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
BLOCKED = {'node_modules', '__pycache__', '.git', '.env', '.npmrc', '.app.json', 'runtime.json'}


def validate_vendor(root):
    expected = json.loads((root / 'vendor-integrity.json').read_text())
    found = {str(p.relative_to(root / 'vendor/rea')): hashlib.sha256(p.read_bytes()).hexdigest()
             for p in (root / 'vendor/rea').rglob('*') if p.is_file() and not p.is_symlink()}
    if found != expected:
        raise ValueError('Preserved upstream tree differs from the reviewed vendor-integrity.json manifest.')
    return len(found)


def validate(root):
    for p in root.rglob('*'):
        if p.is_symlink():
            raise ValueError('Symlinks must not be packaged: ' + str(p.relative_to(root)))
        if p.is_file() and p.name == '.app.json':
            raise ValueError('Public package must not contain private app bindings.')
    m = json.loads((root / 'plugin.json').read_text())
    c = json.loads((root / '.codex-plugin/plugin.json').read_text())
    assert m['$schema'] == 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json'
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', m['name'])
    assert re.fullmatch(r'\d+\.\d+\.\d+', m['version'])
    for k in ['name', 'version', 'description', 'license']:
        assert m[k] == c[k], 'Compatibility identity mismatch: ' + k
    i = m['extensions']['com.openai']['interface']
    assert i == c['interface']
    assert len(i['shortDescription']) <= 30 and len(i['displayName']) <= 30
    assert all(0 < len(x) <= 128 and '\n' not in x for x in i['defaultPrompt'])
    for k in ['logo', 'composerIcon']:
        p = (root / i[k]).resolve()
        assert p.is_relative_to(root.resolve()) and p.is_file()
    for manifest in [m, c]:
        assert 'apps' not in manifest
        assert 'apps' not in manifest.get('extensions', {}).get('com.openai', {})
    portable = json.loads((root / 'mcp.json').read_text())
    legacy = json.loads((root / '.mcp.json').read_text())
    assert portable['$schema'] == 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json'
    assert set(portable['mcpServers']) == {'rea'}
    for name, server in portable['mcpServers'].items():
        assert server['type'] == 'stdio' and server['command'] == 'python3'
        assert server['args'] == ['${PLUGIN_ROOT}/server/gateway.py']
        assert legacy['mcpServers'][name] == {k: v for k, v in server.items() if k != 'type'}
        for a in server['args']:
            assert a.startswith('${PLUGIN_ROOT}/')
            assert (root / a.removeprefix('${PLUGIN_ROOT}/')).is_file()
    skill = root / 'skills/rebuild-with-rea/SKILL.md'
    text = skill.read_text()
    assert text.startswith('---\nname: rebuild-with-rea\n') and '\ndescription: ' in text
    # This authored frontmatter uses only literal scalars; the native host parser
    # remains the integration authority. No third-party YAML runtime is invoked.
    assert 'vendor/rea/skills/reverse-engineer-anything/SKILL.md' in text
    count = validate_vendor(root)
    for p in root.rglob('*'):
        if p.is_file() and p.suffix in {'.md', '.json', '.py', '.yaml', '.svg'}:
            raw = p.read_bytes()
            if (str(Path.home()) + '/').encode() in raw:
                raise ValueError('Host-private material found: ' + str(p.relative_to(root)))
    return {'package': m['name'], 'version': m['version'], 'preserved_vendor_files': count,
            'portable_manifest': 'passed', 'compatibility_manifest': 'passed',
            'native_session_attachment': 'not established by package validation',
            'directory_submission': 'incomplete; see docs/RELEASE.md'}


def validate_zip(path):
    with tempfile.TemporaryDirectory() as d:
        with zipfile.ZipFile(path) as z:
            for item in z.infolist():
                p = Path(item.filename)
                if p.is_absolute() or '..' in p.parts or set(p.parts) & BLOCKED:
                    raise ValueError('Unsafe/private archive member: ' + item.filename)
                if item.external_attr >> 16 & 0o170000 == 0o120000:
                    raise ValueError('Symlink in archive: ' + item.filename)
            z.extractall(d)
        root = Path(d)
        if not (root / 'plugin.json').is_file():
            children = list(root.iterdir())
            assert len(children) == 1 and children[0].is_dir()
            root = children[0]
        return validate(root)


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--archive', type=Path)
    args = p.parse_args()
    print(json.dumps(validate_zip(args.archive) if args.archive else validate(ROOT), indent=2))
