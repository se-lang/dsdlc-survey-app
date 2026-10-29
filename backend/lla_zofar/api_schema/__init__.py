import sys

from pydantic import BaseModel


def init_zofar_api_schema():
    """
    Make sure the Pydantic models for the Zofar API schema are initialized.
    This should be called at startup.
    :return:
    """
    from .unions import ZfAnyElement
    from .base import ZfElement

    # ZfElement (and subclasses) must be able to reference ZfAnyElement, because
    # the API schema is recursive. To break this circle, ZfAnyElement is not imported by
    # ZfElement subclasses and instead uses a forward reference (strings at the moment, until we
    # get built-in lazy evaluation in 3.14).
    # This code populates any modules that have ZfElement subtypes in them with the actual
    # ZfAnyElement after the fact. Since ZfElement has defer_build=True set, once actual validation
    # of the schema happens, this function has run and the forward references can be resolved
    # by Pydantic.

    def _setup_lazy(cls0: type[BaseModel]) -> None:
        if not cls0.__pydantic_complete__:
            module = sys.modules[cls0.__module__]
            setattr(module, 'ZfAnyElement', ZfAnyElement)
        for subclass in cls0.__subclasses__():
            _setup_lazy(subclass)

    _setup_lazy(ZfElement)
