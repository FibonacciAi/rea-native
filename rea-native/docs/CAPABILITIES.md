# Capability matrix and limits

Original engine capabilities are retained through the bundled **REA 6.5.0**
distribution, rather than reimplemented by the workbench. The shipped upstream
skill describes 207 tools. Actual runtime discovery is the authority for
availability; a static tool count is not a live verification.

| Input / workflow | Actual implementation | Acquisition / evidence boundary | Verification status |
|---|---|---|---|
| Git HTTPS URL | Workbench classification; native Codex Git/source tools; bounded local inventory | Host downloads a pinned source snapshot; no target scripts, hooks or submodules | Routing and local inventory tested; live download/build workflow pending native acceptance |
| Local source repository | Workbench inventory + native source tools | Hidden/sensitive/vendor/build files excluded; source semantics interpreted by Codex | Static fixture tests pass |
| npm identifier or registry URL | Workbench classification; native registry read/download; REA static JS inspection | Pin version and registry integrity, inspect archive; never install the target | Classification tested; remote acquisition is a host workflow, not a workbench fetch adapter |
| Website | Native web read; original REA browser tools for approved runtime scenarios | Static HTML is not runtime behavior; browser debugging/profile/action scope required | Routing tested; browser runtime not tested |
| JS/Electron directory / ASAR | Original `analyze_javascript_application`, focused graph/feature tools | Static parsing, no target execution; ASAR integrity limitations retained | Live REA 6.5.0 static JS fixture call passed through native Codex MCP; 207 original tools discovered |
| Archive / application package | Original `open_binary` + `inspect_artifact` | Inventory/extraction limits and provider prerequisites retained | Routing tested; real engine workflow unverified |
| Native executable | Original binary/provider workflows | Hopper/Ghidra/IDA or applicable offline engine required; no engine purchased/installed | Binary magic routing tested; decompilation unverified |
| Managed / WASM / Android / firmware | Original tools and original platform/tool prerequisites | Some require external engines or Linux; no cross-platform promises added | Preserved implementation; host/provider workflows unverified |
| Runtime behavior / captures | Original REA scenario and capture tools | Opt-in; REA capture is not a security sandbox; never automatic execution | Unverified; requires explicit scenario, consent and appropriate isolation |
| Evidence → specification | `prepare_build` validates claims, evidence references, contracts and tests | Caller-supplied evidence is not independently authenticated by the validator | Positive/negative validation and inline MCP transport tests pass |
| Specification → implementation | Packaged native skill continues through current Codex edit/test tools | Same session, normal user authorization; no hidden thread-creation API | Native ephemeral session returned inline specification; current task built/tested the fixture; autonomous model activation not tested |
| Finite parity / improvements | `assess_parity` requires test and original-evidence locators; ranked proposal contract | Accounting of supplied results only; never global equivalence | Native accounting passed against six real owned-fixture comparisons; real-target/global parity unmeasured |

## Interface contracts

The workbench's JSON-RPC stdio implementation advertises four MCP tools:

- `route_target(target: string)` → kind, next tools, acquisition steps and effects.
- `inspect_local(target: absolute path)` → at most 256 file records and 64 KiB
  sampled per file, with SHA-256, exact sample completeness and coverage limits.
- `prepare_build(target, evidence[], features[], improvements?)` → validated
  specification, stable specification SHA-256 and inline native build instructions.
- `assess_parity(specification, results[])` → finite counts and missing feature IDs;
  unreported tests count as not run; global parity stays unknown.

Each tool is read-only, closed-world and nondestructive. None downloads sources,
runs a shell, executes targets, writes files, or starts another Codex session.
Original REA tools retain their own effect annotations and approval requirements.

`prepare_build` evidence records require `id`, `state`, `locator`, `summary`.
Feature records require `id`, `name`, `interface`, `behavior`, `test`, `state`,
`evidence_ids`. Use a command/input/expected-output procedure in each test.
Improvements require `rank`, `proposal`, `benefit`, `cost`, `risk`, `validation`.

The state vocabulary is `observed-static`, `observed-runtime`, `source-derived`,
`inferred`, `unknown`. Runtime observations require runtime evidence. Source
exports and strings are clues, not proof of executable behavior.

## Ranked improvements in this integration

| Rank | Improvement | Benefit / cost / risk | Measurement |
|---|---|---|---|
| 1 | One-input classification and scoped native workflow | Less prerequisite knowledge; no new runtime beyond Python; heuristic routing can need correction | Fixture routing and negative-input tests; native task completion still to measure |
| 2 | Typed claim states and evidence linkage | Prevents unsupported parity claims; additional validation step; evidence quality still requires review | Deliberately invalid observation/link tests fail closed |
| 3 | Inline specification-to-build handoff | Reuses current Codex context/tools; no second model service; agent adherence remains probabilistic | Owned native acceptance case: spec → files → executed tests |
| 4 | Explicit finite parity accounting | Makes gaps visible; supplied logs can be wrong; does not authenticate them | Missing tests remain not-run, missing original evidence prevents pass |
| 5 | Isolated exact-release setup and consent gate | Avoids global config/dependency changes; download/disk cost; optional native integrations may need later setup | 172 registry packages installed with scripts disabled; exact-release engine enabled after user approval; native fixture calls passed |

These are implemented workflow/validation improvements. No speed, token-cost,
CPU/memory or real-target feature-parity improvement is claimed without measurement.

## Preserved, provider-dependent breadth

The actual 6.5.0 catalog also contains Go/Rust metadata inspection, WASM/EVM
interfaces, SQLite inspection, recorded crashes, saved web-network captures,
.NET member/boundary workflows, Android/JADX, JEB, ADB, Apktool and packet-capture
workflows. These original tools remain in the gateway catalog. Their presence
is not an execution test or proof that their external providers, host platforms,
licenses, browser/device access or runtime prerequisites are available. No
provider was installed to satisfy an advertised capability claim.
