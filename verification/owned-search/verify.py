"""Execute only the two digest-pinned owned search fixtures on identical inputs."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys

sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
ORIGINAL = ROOT / 'rea-native/examples/js-fixture/search.js'
RECONSTRUCTION = HERE / 'search.py'
EXPECTED = {
    ORIGINAL: '7a546be642e5480fb47adb5186f36f7f826f605c7a2285a00de40213e566c7e6',
    RECONSTRUCTION: '015ad796d1afa60eb666d641ff9db47230041b917a6e0ffe402677161a8fe9ea',
}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--node', required=True, help='Existing trusted Node executable; no download is performed')
    args = parser.parse_args()
    for path, expected in EXPECTED.items():
        if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise ValueError('Owned fixture changed; review it before execution: ' + str(path.relative_to(ROOT)))
    cases = json.loads((HERE / 'cases.json').read_text())
    code = 'import {readFileSync} from "node:fs"; import {search} from ' + json.dumps(ORIGINAL.as_uri())
    code += '; const cases=JSON.parse(readFileSync(0,"utf8")); process.stdout.write(JSON.stringify(cases.map(c=>search(c.items,c.query))));'
    original = json.loads(subprocess.run([args.node, '--input-type=module', '-e', code],
        input=json.dumps(cases), text=True, capture_output=True, check=True, timeout=10).stdout)
    loader = importlib.util.spec_from_file_location('owned_search_reconstruction', RECONSTRUCTION)
    module = importlib.util.module_from_spec(loader)
    loader.loader.exec_module(module)
    reconstruction = [module.search(c['items'], c['query']) for c in cases]
    matches = sum(a == b for a, b in zip(original, reconstruction))
    result = {'matches': matches, 'cases': len(cases), 'scope': 'Declared ASCII cases only',
        'original_executed': True, 'reconstruction_executed': True, 'global_parity': 'unknown'}
    print(json.dumps(result, indent=2))
    if original != reconstruction:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
