# Source and version selection

Checked 2026-10-16 using official GitHub, rea.tools, npm registry metadata,
the downloaded release, and release-matched source. No target snapshots, private
history or personal files are included in the public package.

## Identity

The exact phrase **Reverse Engineer Anything**, its `REA` abbreviation,
cross-agent MCP workflow, current public project activity, and mutual links
between [morluto/rea](https://github.com/morluto/rea), [rea.tools](https://rea.tools)
and [rea-agents](https://www.npmjs.com/package/rea-agents) establish a strong
match to the requested viral project. This was identified before implementation.

## Compared versions / distributions

| Candidate | Evidence and tradeoff | Decision |
|---|---|---|
| Official `rea-agents@6.5.0` | npm latest; published 2026-10-14; built CLI/MCP runtime and matching skill; exact direct dependencies; release source lock available | Selected foundation; no floating `latest` at runtime |
| Official 6.4.0 / 6.3.0 | npm and GitHub tags identify earlier releases from Oct 11 / Oct 10 | Credible official fallbacks, older than current fixes; no demonstrated reason to downgrade |
| Official `main` at `fe2a398dd9ab290ba6cb3411403d319cec8d07a2` | Newer source at review time; active lifecycle/ownership fixes; not the npm artifact being packaged | Track for later reviewed upgrades; do not silently mix its features with 6.5.0 |
| Upstream skill-only install | Genuine upstream instructions, explicitly says it does not register the MCP server or add tools to a running session | Insufficient for the user's requested working engine; not substituted |
| Repositories copying the name/README or unverified forks | Upstream warns against lookalikes. Fork-list API returned an error, and no independently verified better fork was established | No claim of exhaustive fork review; do not install an unverified lookalike |

The official project was not archived and had recent source changes at review
time. Activity demonstrates maintenance, not security or correctness. No claim
is made that it is the best reverse-engineering engine for every target.

## Integrity and trust

The official npm archive's SHA-512 matched registry metadata. The retrieved
npm provenance payload's subject digest matched the same bytes and named
`https://github.com/morluto/rea` and source commit
`3b79af28e80785afce9f5998d8f03289402a1847`. GitHub's
`rea-agents-6.5.0` tag pointed to the same commit.

**Limit:** this verifies byte consistency and agreement between the retrieved
records. The Sigstore certificate/signature chain and reproducible build were
not independently verified. This is not a comprehensive security audit.

Static review covered archive paths/symlinks, license and notices, package
metadata/dependency lock, CLI dispatcher and production MCP entrypoint, setup
write/process/download boundaries, effect annotations, the shipped skill and
connection/evidence guidance. No third-party source was executed for this review.
The original installer can offer Hopper installation and edit agent config;
the integration instead preserves native Codex plugin installation and a separate
reviewed runtime plan, without purchasing or installing providers.

There are no package `preinstall`, `install` or `postinstall` lifecycle entries.
The package has `prepare` and `prepack`; transitive packages may have scripts,
so all lifecycle scripts are disabled by the isolated installer. Optional native
integrations may consequently need separately reviewed setup before use.

REA-authored code is MIT, with third-party qualifications and notices retained.
The notice inventory explicitly records some upstream archive notice gaps;
these are preserved rather than described as fully resolved. REA's license
does not grant licenses to proprietary engines or target software/assets.

## Native Codex compatibility

REA upstream supports Codex via local stdio MCP. The installed Codex CLI exposes
`plugin marketplace add`, `plugin add`, and `plugin list`. Current OpenAI docs
support packaged skills, local stdio MCP, root portable manifests and the native
compatibility overlay. The native installer is the verification authority for
the package; session attachment and actual engine calls require separate checks.

Public-directory publication is a different workflow: local MCP submissions
currently require partner allowlisting according to
[OpenAI's desktop-only plugin guidance](https://developers.openai.com/plugins/deploy/desktop-only).
A public source/marketplace repository can be prepared independently once the
user chooses the publisher and repository destination.
