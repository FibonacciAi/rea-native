#!/usr/bin/env python3
"""Launch the preserved REA engine only from an explicitly approved runtime."""
import json
import os
from pathlib import Path
import sys

DATA = Path(os.environ.get('REA_NATIVE_DATA', Path.home() / '.local/share/rea-native'))


def main():
    receipt = DATA / 'runtime.json'
    if not receipt.is_file():
        sys.stderr.write('REA engine setup pending. The workbench remains usable. Run the packaged setup workflow, review its plan, and approve the pinned runtime before execution.\n')
        return 78
    data = json.loads(receipt.read_text())
    if data.get('version') != '6.5.0' or data.get('source_execution_approved') is not True:
        sys.stderr.write('REA runtime receipt is missing exact-version source execution approval.\n')
        return 78
    node, entry = Path(data['node']), DATA / 'engine/scripts/rea.mjs'
    if not node.is_file() or not entry.is_file():
        sys.stderr.write('Approved REA runtime is missing; review setup again.\n')
        return 78
    os.execv(str(node), [str(node), str(entry), 'mcp'])


if __name__ == '__main__':
    sys.exit(main())
