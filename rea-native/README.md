# REA Native

Give native Codex one app, repository, package, website or binary. Inspect a small
feature, keep its evidence, build a compatible implementation, and test it.

This independent MIT integration preserves [morluto/rea](https://github.com/morluto/rea)
`rea-agents@6.5.0`, commit `3b79af28e80785afce9f5998d8f03289402a1847`.
It is not an official upstream release or an approved OpenAI Directory listing.
See [attribution and third-party terms](NOTICE.md).

## Install and use

1. From the marketplace **source archive's root**, use your intended native
   client's supported CLI:

   ```sh
   codex plugin marketplace add . --json
   codex plugin add rea-native@rea-native --json
   ```

   The development marketplace uses `rea-native@rea-native-development` instead.
   A plugin-only ZIP is for distribution; the source archive includes the local
   marketplace. Follow [installation](docs/INSTALL.md) rather than editing caches.

2. Review the isolated engine setup plan with a supported existing Node runtime:

   ```sh
   python3 rea-native/scripts/setup_runtime.py --node /absolute/path/to/node
   ```

   Follow [the dependency staging and execution approval steps](docs/INSTALL.md).
   Python 3.10+ is required; REA supports Node 22.19+, 24.11+, or 26+ on its
   documented release lines. Setup disables npm lifecycle scripts, installs no
   analysis provider, and refuses engine execution without exact-release approval.

3. Reconnect as required by the client, select **REA Native**, and give one input:

   > Understand this app and build a small compatible version with evidence and
   > tests: /absolute/path/to/an/owned/app

   HTTPS URLs and `npm:package@version` are also routed. The skill uses the single
   `rea` MCP endpoint, with `a_rebuild` for routing, bounded inventory, an inline
   build handoff and finite parity accounting. It continues through native
   workspace edits and permitted tests. Untrusted target code never runs by default.

## What was tested

Version 0.1.6 passed 18 unit/protocol tests. A simple target prompt in the bundled
native CLI `0.162.0-alpha.17.2`, using an explicitly temporary `gpt-6-luna`
selection and existing configuration, automatically selected the skill and
completed routing, inspection, real REA analysis, build handoff, implementation
tests and parity accounting. This does not verify every GUI conversation or the
configured everyday model route. The older standalone CLI `0.154.0` rejected the
tested account/model combination; use a compatible native client, not a hidden
saved-default change. See [activation and recovery](docs/ACTIVATION.md).

The owned JavaScript search fixture and the generated Python reconstruction were
then actually executed on the **same six ASCII cases: 6/6 matched**. That separate
differential test establishes only those cases. Generated tests against
source-derived expectations alone are **not original runtime parity**. Unicode,
invalid inputs, real applications and global equivalence remain unverified.

## Limits and development

All 207 original engine tools retain their names and schemas. Native decompilers,
browser/runtime capture, mobile/device tools and other external providers keep
their own installation, access, platform and license requirements; their presence
in the catalog is not a successful test. Remote acquisition uses existing Codex
tools. This source package needs its consented runtime bootstrap and is not an
offline runtime bundle. [Capabilities](docs/CAPABILITIES.md) lists the boundaries.

Use only targets you own or may inspect. No new model account or hosted service
is added. Existing Codex/model usage and separately selected providers retain
their own costs. Never package credentials, private evidence or restricted assets.

```sh
cd rea-native
python3 -m unittest discover -s tests -v
python3 scripts/validate_package.py
```

[Architecture](docs/ARCHITECTURE.md) · [Review cases](docs/REVIEW.md) ·
[Release requirements](docs/RELEASE.md) · [Privacy facts](docs/PRIVACY-FACTS.md)
