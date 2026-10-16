# Attribution and source preservation

REA Native includes the complete published REA 6.5.0 distribution unchanged,
except that the matching source release's `package-lock.json` is added for
deterministic, script-disabled dependency setup.

- Upstream: https://github.com/morluto/rea
- Website: https://rea.tools
- Package: https://www.npmjs.com/package/rea-agents
- Release tag: `rea-agents-6.5.0`
- Source commit: `3b79af28e80785afce9f5998d8f03289402a1847`
- REA-authored code: **MIT, Copyright (c) 2026 morluto**.
- Original license: [vendor/rea/LICENSE](vendor/rea/LICENSE).
- Third-party notices: [vendor/rea/THIRD_PARTY_NOTICES.md](vendor/rea/THIRD_PARTY_NOTICES.md).
- Preserved component licenses: [vendor/rea/licenses](vendor/rea/licenses)
  and [vendor/rea/third_party](vendor/rea/third_party).

The workbench, launcher, native orchestration skill and documentation are new
integration work under the root MIT license. Upstream files are not relicensed.
The integration must not be represented as an official upstream product.

Commercial engines including Hopper, IDA and JEB are not included or licensed
by this package. External engines and Node/npm dependencies retain their own
terms. The upstream notices document missing license/copyright documents for
some dependency archives; those gaps remain explicit. This integration does
not claim to have resolved them or to establish legal rights in analyzed targets.
