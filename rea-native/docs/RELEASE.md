# Public release preparation — incomplete

The implementation and source package are prepared for review. **This is not an
OpenAI-directory-submission-ready package.** No upload, submission or publication
has occurred. A valid native source package is separate from public listing
approval and from a verified engine/session installation.

## Public source preview

The GitHub source preview is published under `FibonacciAi/rea-native`.
A public GitHub repository and a validated local plugin are separate from an
OpenAI Directory listing or verified OpenAI developer identity. This package
must not be described as submitted to or approved by that Directory.

### Public GitHub source / Codex marketplace release

Prepared source can be placed in a selected public repository with this layout:

```text
.agents/plugins/marketplace.json
rea-native/
  plugin.json
  .codex-plugin/plugin.json
  mcp.json
  .mcp.json
  skills/
  server/
  scripts/
  vendor/rea/
  docs/
```

Preserve all license/notices and the vendor-integrity manifest. Do not publish
research downloads, runtime/dependency directories, user approval receipts,
machine paths, private evidence, personal files, session logs or secrets.
The plugin ZIP contains one plugin only; a separate marketplace source archive
may contain the top-level marketplace. Review the exact final archive before
any public push. Source release installation still needs the consented isolated
runtime setup; it is not an offline self-contained runtime bundle.

### OpenAI Plugin Directory

Current official documentation says **local MCP submissions are restricted to
approved partners**, with the submitting organization allowlisted. Verify that
eligibility before portal upload. A remote MCP endpoint would change this
product's architecture and privacy scope; do not substitute one without request.

Outstanding listing/review requirements:

- Selected verified publisher identity and organization, supported countries (or
  explicit all-country choice), confirmed commerce declaration.
- Four real, accessible, content-verified HTTPS pages: plugin website, support,
  privacy policy and terms. No placeholder URLs have been inserted.
- Final listing category supported by the target portal, publisher name and
  any chosen translations. Title/subtitle/default prompts are already drafted
  in the manifest with required length limits.
- Native SVG development icon exists. Public submission needs suitable actual
  square PNG assets, generated/reviewed for legibility and referenced in the
  package; optional dark variants and brand colors can be chosen later.
- Consent-approved complete runtime bundle for the target platform, all actual
  dependency notices, clean native installation and tool/workflow verification.
  See [activation and recovery](ACTIVATION.md) for the scoped bundled-client
  acceptance and the older standalone model/account limitation.
- Five positive and three negative cases are drafted in REVIEW.md. Native
  review cases have not all run and have not been imported as passed metadata.
- Actual, readable, reviewer-accessible demo recording and verified URL; a
  recording plan is not a video.
- Secure reviewer access for any needed external environment, portal identity /
  domain verification, scans, and user-completed legal/policy attestations.

Release notes are embedded in `publication.release_notes`. Unknown countries,
publisher facts, commerce declarations, policy URLs and demo URL are absent,
not fabricated or represented by empty fields.

## Draft listing

**Name:** REA Native

**Subtitle:** Inspect, rebuild, verify

**Description:** A native Codex workbench built on the official REA engine. Give
it a repository, website, package or binary. It routes inspection, preserves
evidence and uncertainty, develops interface and behavior contracts, and guides
Codex through implementation and finite parity tests in the current session.
Untrusted target code never runs automatically. Provider support varies.

**Initial release:** Preserved official REA 6.5.0; one-input routing, bounded
static source inventory, evidence-linked specification handoff, reproduction
test workflow, finite parity accounting and isolated script-disabled setup.

## Policy preparation

The package adds no telemetry or hosted service. Analysis results and selected
source data can enter the user's Codex/model context; applicable host/provider
policies govern that processing. Runtime dependency downloads contact npm;
explicit web/browser/provider workflows have their own effects. Evidence and
implementation saved by Codex remain in the selected workspace. These are
implementation facts, **not publisher commitments** about retention, deletion,
support response or legal terms. Confirm actual collection/sharing/retention/
deletion/support arrangements with the publisher before drafting and hosting
binding policy pages. Nothing here is a published policy or legal attestation.
