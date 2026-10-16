# Owned static engine fixture

No dependencies, install scripts, assets, credentials or network calls.
Use the containing directory as `analyze_javascript_application.input_path`
after source-execution consent and actual engine connection.

Native acceptance prompt:

> Understand this fixture's search function and build a Python version in my
> workspace. Preserve observable behavior, cite evidence, write reproduction
> tests first, then implement and compare. Do not execute the JS fixture until
> I approve that specific owned-fixture command.

Finite contract cases for runtime comparison, once approved:

| Items | Query | Expected output |
|---|---|---|
| `["Alpha", "Beta", "alphabet"]` | `" ALP "` | `["Alpha", "alphabet"]` |
| `["Alpha", "Beta"]` | `""` | `[]` |
| `["Alpha", "Beta"]` | `"  "` | `[]` |
| `["Alpha", "Beta"]` | `"z"` | `[]` |
| `["x", "x", "X"]` | `"x"` | `["x", "x", "X"]` |
| `[]` | `"x"` | `[]` |

These expected outputs are **source-derived until the original fixture runs**.
ASCII examples establish no cross-language Unicode normalization equivalence.
Invalid input types are outside this finite contract. Passing all six cases
does not establish global parity or REA's behavior on real applications.
