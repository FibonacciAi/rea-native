# Architecture and native handoff

```text
User's one target in native Codex
  -> packaged rebuild-with-rea skill
  -> rea.route_target
  -> native source/web acquisition OR preserved original REA engine inspection
  -> actual evidence + coverage + license/source identity
  -> rea.prepare_build
  -> inline MCP structuredContent in the same Codex turn
  -> native Codex file edits, reproduction tests and implementation
  -> original/reconstruction comparisons + rea.assess_parity
```

The single `rea` stdio gateway exposes the four bounded workbench tools plus
`plugin_status` and the visible `a_rebuild` entry, followed by the original engine catalog. Original names, input
schemas, annotations and results are preserved. The approved engine runs as a
child of this gateway; JSON-RPC requests, notifications, errors and engine-to-host
requests are relayed without self-approving any access. External provider logic
remains upstream. The gateway adds no network service, model call, credential
store or authority to run targets, install providers, publish or spend.

This replaces the earlier two-server topology, which connected through direct
native API tests but did not expose callable workbench tools reliably in the
model-driven acceptance session. One endpoint also avoids relying on multi-MCP
selection behavior. The native model inventory also exposed only an alphabetic
subset of the full registered engine catalog in acceptance. The early-sorted
`a_rebuild` entry dispatches all workbench actions through one visible schema;
individual tools and all original engine schemas remain intact. `plugin_status` supplies the exact installed skill path;
installation uses the intended native client's supported plugin installer.

The native plugin/session interface was checked against the installed
bundled native `codex-cli 0.162.0-alpha.17.2` help and current OpenAI documentation:

- https://developers.openai.com/plugins/build/plugins
- https://developers.openai.com/plugins/build/skills
- https://developers.openai.com/plugins/deploy/desktop-only

Codex skills can call MCP tools and continue a workflow with host tools. That
documented mechanism is used directly. No API for injecting prompts into an
arbitrary session is assumed or bundled. There is no subprocess calling another
model or thread-creation side channel. Native installation/attachment must still
be verified independently in the actual intended host session.

Setup installs into a new isolated runtime directory. It uses the release-matched
lockfile and `npm ci --ignore-scripts --omit=dev`; no target or analysis engine is
installed. A successful setup records exact-version execution approval locally.
The engine launcher refuses when that receipt is absent. Public archives must
never include the receipt, user-specific runtime path or installed dependency
tree. A self-contained directory submission would need an eligible separately
prepared runtime bundle and actual clean-install verification.

## Verification boundaries

Package tests cover safe workbench behavior, evidence-state validation, the
combined catalog, preserved engine responses/resources/errors/notifications,
and relayed engine-to-host requests. A real approved REA 6.5.0 connection returned
207 original tools plus six integration tools through this single endpoint.

Native API tests and model-driven prompt tests are distinct. See
[activation](ACTIVATION.md) for the latest model-driven acceptance scope.
A temporary model selection is disclosed and does not establish the configured
everyday route. Fixture implementation checks against source-derived expectations
are not runtime differential parity, and finite comparisons are not global parity.
Private logs and machine-specific results stay outside the public package.
