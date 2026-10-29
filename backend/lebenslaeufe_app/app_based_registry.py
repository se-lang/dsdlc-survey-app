from abc import ABC
from collections.abc import Collection
from importlib import import_module
from typing import Literal

from django.apps import apps
from django.dispatch import Signal


class AppBasedRegistry[T](ABC):
    app_module_name: str
    register_signal: Signal
    _registry: dict[str, T]
    _state: Literal['initial', 'open', 'frozen']

    def __init__(self):
        self.register_signal = Signal()
        self._state = 'initial'
        self._registry = {}

    def _build(self):
        if self._state == 'open':
            raise RuntimeError(f'{type(self).__name__} being built recursively')
        elif self._state == 'frozen':
            return

        self._state = 'open'
        success = False
        try:
            for app in apps.get_app_configs():
                try:
                    import_module(f'{app.module.__name__}.{self.app_module_name}')
                except ModuleNotFoundError:
                    continue

            self.register_signal.send(type(self), registry=self)
            success = True
        finally:
            if success:
                self._state = 'frozen'
            else:
                self._state = 'initial'
                self._registry = {}

    def _register_internal(self, key: str, value: T) -> None:
        if self._state != 'open':
            raise RuntimeError(f'{type(self).__name__} registrations are not open.')
        self._registry[key] = value

    def keys(self) -> Collection[str]:
        self._build()
        return self._registry.keys()

    def items(self) -> Collection[tuple[str, T]]:
        self._build()
        return self._registry.items()

    def get_registrations(self) -> Collection[T]:
        self._build()
        return self._registry.values()

    def __getitem__(self, item: str) -> T:
        self._build()
        return self._registry[item]
