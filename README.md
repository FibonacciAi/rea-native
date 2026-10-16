# REA Native — preview 0.1.6

A native Codex plugin for understanding a target, building a compatible feature,
and checking the result against evidence. It preserves the MIT REA 6.5.0 engine
and adds routing, bounded inspection, build handoff and parity accounting.

## Install in native Codex

Using the CLI bundled with your intended native client:

```sh
codex plugin marketplace add FibonacciAi/rea-native --ref v0.1.6 --json
codex plugin add rea-native@rea-native --json
```

Follow [the isolated engine setup](rea-native/docs/INSTALL.md) with an existing
supported Node runtime. Setup disables npm lifecycle scripts and records engine
execution approval separately. It does not install a decompiler or paid provider.

Reconnect as required, select **REA Native**, and give one target:

> Understand this app and build a small compatible version with evidence and
> tests: /absolute/path/to/an/owned/app

Repositories, HTTPS websites and `npm:package@version` can also be routed.
See [usage and tested capabilities](rea-native/README.md).

## Verified preview

- 18 unit/protocol tests passed.
- A simple target prompt automatically selected the skill and completed the
  workbench → real REA analysis → build handoff → implementation/tests → parity
  workflow in bundled native CLI 0.162.0-alpha.17.2 with a temporary gpt-6-luna
  selection. Saved defaults and unrelated MCP settings were preserved.
- A separate owned-fixture runtime comparison executed the JavaScript original
  and generated Python implementation on identical inputs: **6/6 ASCII cases matched**.

[Sanitized acceptance record](verification/0.1.6.json) ·
[Reproduce the owned-fixture comparison](verification/README.md) ·
[Release downloads](https://github.com/FibonacciAi/rea-native/releases/tag/v0.1.6)

Generated tests against source-derived expectations alone are not original
runtime parity. Finite matches do not prove every input or global equivalence.
Provider-dependent browser/device/native workflows retain their own access,
platform and license prerequisites. The older standalone CLI 0.154.0 rejected
the tested account/model combination; the bundled-client result does not prove
that older route works. These are specific verification boundaries, not a claim
that every application can be reconstructed.

## Source and attribution

This is an independent integration, not an official upstream release or an
approved OpenAI Plugin Directory listing. Foundation: [morluto/rea](https://github.com/morluto/rea),
`rea-agents@6.5.0`, pinned commit `3b79af28e80785afce9f5998d8f03289402a1847`.
REA-authored code is MIT; third-party material retains its original terms.
See [NOTICE](rea-native/NOTICE.md), [provenance](rea-native/UPSTREAM.json), and
[preserved notices](rea-native/vendor/rea/THIRD_PARTY_NOTICES.md).

No installed runtime dependency tree, credentials, private logs or real target source/assets
are included. Use software you own or are authorized to inspect.

```sh
cd rea-native
python3 -m unittest discover -s tests -v
python3 scripts/validate_package.py
```
