# Native activation and recovery

Installed/enabled metadata, native MCP connection, and a model choosing the skill
are different checks. Test all three before calling a release end-to-end verified.

## Ordinary activation acceptance

After installing REA Native in a supported native Codex client, start a normal
conversation with the plugin selected and give one target:

> Understand this app and build a compatible version with evidence and tests:
> /absolute/path/to/an/owned/fixture

Do not inject extra system instructions, disable other MCP servers, change the
model, or ignore the user's configuration to report this as an ordinary test.
An ephemeral test conversation is fine; it must use the normal installed setup.

Pass conditions: the host exposes the packaged skill, the model reads and follows
it, `a_rebuild` routes the exact input, the appropriate inspection returns
real evidence, `prepare_build` returns contracts inline, the same conversation
writes an implementation/tests, and permitted tests produce recorded results.
Keep each unmet condition explicit. An API client making those calls directly
does not prove model-driven activation.

## Diagnose the actual boundary

- **Unsupported model/account before sampling:** no skill or tool selection has
  occurred. Do not reinstall the plugin or rerun engine setup. The user must
  choose an account-supported model or a compatible native client through its
  supported settings/update path. Do not silently change their model, login or
  authentication route.
- **Invalid unrelated MCP transport/configuration:** preserve the saved config.
  Report the exact failing entry and ask the owner to resolve it separately.
  A temporary test override can isolate the plugin, but its result must be
  labeled an overridden integration test.
- **Engine tools missing while the workbench is connected:** inspect the REA
  launcher error and approved runtime path. Registration, dependency staging,
  source-execution consent and session reconnection are separate states.
- **Skill descriptions shortened by host context limits:** the host can still
  list the skill. This warning does not prove activation failure. Do not disable
  unrelated plugins or skills automatically.
- **Large evidence result exceeds transport budget:** keep the same engine
  session, recover through the returned retained Evidence reference and a
  summary/focused view or local export. Never call the completed analysis a
  parser failure or infer missing features from partial graph coverage.

## Model-facing catalog and path recovery

The native API can register more tools than appear in the model's callable
inventory. In the tested client, an alphabetic subset omitted individual
routing/build tools even though the full catalog existed. Use the early-sorted
`rea.a_rebuild` entry with `action` selecting routing, inventory, handoff, parity
or status. The original REA engine tools and individual workbench tools remain
in the full catalog; no original tool is removed or renamed.

Install/reload with the same native client's supported plugin installer and
check the returned existing skill path. A model may still reconstruct a wrong
cache path; `a_rebuild` with `action: "plugin_status"` returns the actual path.
Do not create guessed cache directories or copy the skill into personal paths.

## Current verification limits

The integration's earlier native API tests passed on an owned fixture and a
real deployed JavaScript bundle. Those API tests used process-only configuration
isolation and were not model-driven acceptance.

The older standalone CLI rejected its configured model/account combination
before sampling. The bundled native client accepted a disclosed temporary
`gpt-6-luna` selection. Keep its scoped acceptance separate from the unchanged
configured everyday route. Source-derived implementation tests alone establish
neither original runtime behavior nor global parity. Detailed host-specific
logs and test data stay outside the public package.

## Version 0.1.6 acceptance

A simple local-target prompt in bundled native CLI `0.162.0-alpha.17.2`, with
a disclosed temporary `gpt-6-luna` selection, automatically selected and read
the correct skill. In the same conversation it called the visible workbench
entry for route/inventory, called real REA static JavaScript analysis, consumed
the actual build handoff, created a Python implementation and six tests, and
completed finite parity accounting. Its first accounting request used the
wrong specification field and was rejected; the corrected request succeeded.
Because original execution was prohibited inside that model test, parity was
honestly reported as one blocked feature and zero passes.

A separately authorized owned-fixture differential check then executed the
original JavaScript and that generated Python function on identical six ASCII
inputs: all six outputs matched. Direct authored-workbench accounting linked
those actual logs to the original native handoff. This was not another model
turn, proof of every input, or a general real-target reconstruction test.

The saved configuration matched its exact pretest SHA-256 after verification.
No model default, credential or unrelated MCP entry was changed to obtain the
result. Prior failed/incomplete candidate tests remain distinct from this pass.
