"""Dependency-free Python port of the supplied JavaScript search fixture."""

from collections.abc import Iterable


def search(items: Iterable[str], query: str) -> list[str]:
    """Return items containing the trimmed, case-insensitive query.

    Original item values, order, and duplicates are preserved. This port is
    validated against the fixture's six finite ASCII examples; exact
    cross-language Unicode behavior is not part of that finite contract.
    """
    needle = query.strip().lower()
    if not needle:
        return []
    return [item for item in items if needle in item.lower()]
