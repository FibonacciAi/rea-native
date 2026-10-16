# Bounded acceptance evidence

`0.1.6.json` records the observed checks without private machine paths, session
identifiers or logs. The native model test deliberately did not execute its
target, so it reported runtime parity blocked. A separate authorized comparison
then actually executed the included owned JavaScript fixture and generated
Python function on the six identical JSON cases stored here.

Reproduce that small comparison with an existing supported Node executable:

```sh
python3 verification/owned-search/verify.py --node /absolute/path/to/node
```

The driver checks the two owned source digests before execution, uses no network
or dependencies, and compares actual outputs. It never runs a third-party target.
The stored result arrays are observations, not a claim of complete equivalence.
Unicode, invalid inputs and other targets remain outside these six cases.
