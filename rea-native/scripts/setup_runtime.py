#!/usr/bin/env python3
"""Plan first; explicitly approved isolated dependency installation. No target code."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def plan(node, destination):
    node = Path(node).expanduser().resolve(strict=True)
    version = subprocess.check_output([str(node), '--version'], text=True).strip()
    nums = [int(x) for x in version.lstrip('v').split('.')]
    if not (nums[0] == 22 and nums >= [22, 19, 0] or nums[0] == 24 and nums >= [24, 11, 0] or nums[0] >= 26):
        raise ValueError('REA requires Node ^22.19, ^24.11, or >=26. Found ' + version)
    npm = shutil.which('npm')
    if npm is None:
        raise ValueError('Bring an existing npm installation; no runtime is downloaded automatically.')
    npm = str(Path(npm).resolve(strict=True))
    d = Path(destination).expanduser().absolute()
    staged = d / 'dependencies.json'
    if d.exists() and not staged.is_file():
        raise ValueError('Destination already exists without a completed dependency stage; preserve it and choose a fresh directory. No overwrite.')
    if staged.is_file() and json.loads(staged.read_text()).get('version') != '6.5.0':
        raise ValueError('Existing staged runtime is a different version; choose a fresh destination.')
    return {'source': json.loads((ROOT / 'UPSTREAM.json').read_text()), 'node': str(node),
            'node_version': version, 'destination': str(d), 'dependencies_staged': staged.is_file(),
            'command': [str(node), npm, 'ci', '--ignore-scripts', '--omit=dev', '--no-audit', '--no-fund'],
            'effects': ['Reuse verified completed dependency staging, or copy the preserved REA distribution and release lockfile into a fresh destination.',
                       'Only when unstaged: download the locked runtime dependency graph from npm using the existing npm client.',
                       'Disable all lifecycle scripts. Dependency-only staging does not authorize or launch REA.',
                       'Engine enabling is separate and requires exact-version action-time source-execution consent.'],
            'cost': 'Network and disk usage; no payment. Exact size depends on platform dependencies. No target is run; no provider is installed.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--node', default=shutil.which('node'))
    parser.add_argument('--destination', default=str(Path.home() / '.local/share/rea-native'))
    parser.add_argument('--apply', action='store_true')
    parser.add_argument('--dependencies-only', action='store_true', help='Install the locked registry dependencies without enabling/running REA.')
    parser.add_argument('--approve-source', choices=['rea-agents@6.5.0'])
    args = parser.parse_args()
    if not args.node:
        parser.error('Supply an existing supported --node path.')
    proposed = plan(args.node, args.destination)
    print(json.dumps(proposed, indent=2), flush=True)
    if not args.apply and not args.dependencies_only:
        return
    if args.apply and args.approve_source != 'rea-agents@6.5.0':
        parser.error('--apply requires explicit action-time approval and --approve-source rea-agents@6.5.0')
    # Verify every preserved upstream file, including the release lockfile, before
    # allowing the trusted package manager to consume it. No upstream code runs.
    from validate_package import validate_vendor
    validate_vendor(ROOT)
    # A CLI flag records the host user's decision; it cannot grant the agent authority.
    d = Path(proposed['destination'])
    engine = d / 'engine'
    if not proposed['dependencies_staged']:
        d.mkdir(parents=True, exist_ok=False)
        shutil.copytree(ROOT / 'vendor/rea', engine)
        env = dict(os.environ)
        env['PATH'] = str(Path(proposed['node']).parent) + os.pathsep + env.get('PATH', '')
        env['npm_config_ignore_scripts'] = 'true'
        env['npm_config_cache'] = str(d / 'npm-cache')
        completed = subprocess.run(proposed['command'], cwd=engine, env=env)
        if completed.returncode:
            sys.exit(completed.returncode)
        (d / 'dependencies.json').write_text(json.dumps({'version': '6.5.0', 'lifecycle_scripts': 'disabled'}, indent=2) + '\n')
    expected = json.loads((ROOT / 'vendor-integrity.json').read_text())
    for name, value in expected.items():
        if hashlib.sha256((engine / name).read_bytes()).hexdigest() != value:
            raise ValueError('Staged engine bytes differ from reviewed source: ' + name)
    if not args.apply:
        print('Dependencies installed with scripts disabled. REA remains disabled and has not executed.')
        return
    receipt = {'version': '6.5.0', 'node': proposed['node'], 'source_execution_approved': True,
               'source': proposed['source'], 'lifecycle_scripts': 'disabled'}
    (d / 'runtime.json').write_text(json.dumps(receipt, indent=2) + '\n')
    print('Runtime installed. Restart/reconnect native Codex; verify the actual REA tools and a harmless fixture call.')


if __name__ == '__main__':
    main()
