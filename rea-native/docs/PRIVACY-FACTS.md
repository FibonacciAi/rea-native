# Privacy facts for publisher review

This describes the implementation. It is not a published privacy policy or a
publisher's legal commitment. Confirm the publisher's actual support, collection,
retention, deletion and disclosure arrangements before publishing policy text.

| Data flow | What the integration does |
|---|---|
| Selected target paths and metadata | The workbench reads the explicitly selected local input with bounded inventory. It excludes hidden/agent-private paths, symlinks and sensitive filenames. It returns metadata/digests rather than raw source contents. This is not a universal secret detector. |
| REA analysis results | The preserved engine can inspect selected artifacts using its advertised tools. Evidence/results enter the native Codex context; the user's host/model provider policies apply. |
| Local output | Codex may save specifications, evidence, implementations and test results in the authorized workspace. Runtime setup saves its dependency/approval receipts in the selected local runtime directory. The package has no automated retention/deletion job. |
| Network | The authored workbench has no network client. Requested Git/web/registry acquisition, optional upstream REA/provider workflows and npm dependency downloads can use the network. The package does not promise all workflows are offline. |
| Credentials | The authored workbench has no credential input or store. Existing npm/host/provider configuration can apply to optional workflows. Do not package credentials, query tokens, user runtime receipts or private evidence. |
| Telemetry and hosting | The authored workbench adds no telemetry or hosted service. This statement does not attest to every dependency, native host, selected browser, analysis engine or model provider. |
| Support/publisher processing | Publisher identity, support contact, support-data handling and any deletion process require publisher confirmation. No contact details or policy URLs have been invented. |

REA process capture runs target processes and is not a security sandbox. Analysis
does not grant source/asset redistribution rights. Keep target execution,
browser attachment, new credentials/access, spending and publication within
their separately authorized scope.
