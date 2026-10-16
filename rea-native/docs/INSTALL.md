# Install through native Codex

This package targets Codex's supported native plugin format. It contains a
portable root manifest and synchronized `.codex-plugin/plugin.json` and
`.mcp.json` compatibility files. No account upload or cloud deployment is needed.

## 1. Install the plugin

From the repository/marketplace root containing `.agents/plugins/marketplace.json`:

```sh
codex plugin marketplace add . --json
codex plugin add rea-native@rea-native --json
codex plugin list --marketplace rea-native --json
```

The public source marketplace is `rea-native`; the development workspace uses
`rea-native-development` and selector `rea-native@rea-native-development`.
Use the exact registered marketplace name. Its entry references `./rea-native`. For a public Git repository,
the publisher should keep this layout; consumers can register the chosen Git
URL, ideally at a reviewed commit, then install the same plugin selector.
Use the plugin installer bundled with the native client you intend to use;
older standalone installers can leave incompatible discovery metadata. Use the
commands advertised by that client's `--help`. Do not copy files
into Codex's cache or replace existing marketplaces/configuration.

The workbench has no third-party Python dependencies. Its startup reads no
target. The single `rea` endpoint serves the workbench and proxies original engine tools.
Engine launch fails closed until the runtime is approved and installed; the
workbench/status tools remain available. Installation alone does not prove connection.

## 2. Review the engine setup plan

```sh
python3 rea-native/scripts/setup_runtime.py --node /absolute/path/to/supported/node
```

The default runtime destination is `~/.local/share/rea-native`. The plan prints
the exact Node path/version, destination, source provenance, npm command and
effects. It installs no Node, Homebrew, Java, Ghidra, Hopper, IDA or other provider.
It does not modify Codex configuration or run target code. It downloads locked
runtime dependencies; all lifecycle scripts are disabled. Optional integrations
whose native modules need install-time compilation may remain unavailable.

The installer refuses to overwrite an existing destination. Review any earlier
failure and choose a fresh destination rather than deleting user data.

## 3. Stage registry dependencies, then approve engine execution separately

The installation request authorizes the locked reputable-registry dependency
download. It does not need another source-execution approval when all lifecycle
scripts remain disabled:

```sh
python3 rea-native/scripts/setup_runtime.py \
  --node /absolute/path/to/supported/node --dependencies-only
```

This creates only `dependencies.json`; the engine remains disabled. The existing
completed dependency stage can be reused without another download. Incomplete or
foreign destinations are preserved and refused.

After the user approves **execution of REA 6.5.0**, use the same node/destination:

```sh
python3 rea-native/scripts/setup_runtime.py \
  --node /absolute/path/to/supported/node \
  --apply --approve-source rea-agents@6.5.0
```

The flag records a decision; it is not authority for an agent to self-approve.
For an already completed dependency stage, this verifies original engine bytes
and writes the approval receipt without rerunning npm. The engine starts only
on the subsequent native MCP connection or explicit approved fixture test.
For a custom destination, pass the same `REA_NATIVE_DATA` environment variable
to the native MCP endpoint through the user's supported local MCP configuration.
Do not place machine-specific paths or approval receipts into a public package.

## 4. Verify in the intended native session

Restart/reconnect Codex as required, select REA Native, and verify:

1. `rea.a_rebuild` with `action: "plugin_status"` returns a real `skill_path`
   and engine readiness; `action: "route_target"` routes a synthetic target.
2. Original REA tools actually appear, with the expected release identity.
3. A static `analyze_javascript_application` call succeeds on a small owned
   fixture without executing it, and returns real Evidence and limitations.
4. The skill consumes a specification and builds/tests an owned fixture in
   the current session. Save original evidence and reconstruction test output.

An MCP protocol test outside Codex is useful, but cannot prove native session
attachment. A successful plugin installer also cannot prove tool discovery.
Keep those statuses separate. Never repeat setup simply to refresh stale tools.

For conservative native tool approval, use Codex's supported plugin-scoped
policy in the user's local config, after reviewing the actual installed plugin
key and server name:

```toml
[plugins."rea-native@rea-native-development".mcp_servers.rea]
default_tools_approval_mode = "prompt"
```

This is a user configuration example, not a policy the package has silently
applied. Do not use blanket approval for target-execution or mutation tools.

## Remove

```sh
codex plugin remove rea-native@rea-native
codex plugin marketplace remove rea-native
```

The source and isolated runtime remain for review/reuse. Remove them only when
the user specifically requests it; the plugin does not delete files automatically.
