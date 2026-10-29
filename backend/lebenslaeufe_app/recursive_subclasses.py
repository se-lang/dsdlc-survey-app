from typing import Iterable


def recursive_subtypes(cls: type) -> Iterable[type]:
    """
    Generate an iterable of this class and all its subtypes, recursively.
    """
    yield cls
    for sub in cls.__subclasses__():
        yield from recursive_subtypes(sub)
