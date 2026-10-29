import enum
import functools
import operator
from collections.abc import Collection, Callable, Iterable, Sequence
from dataclasses import dataclass, field
from enum import Enum
from types import UnionType, NoneType
from typing import (
    Any,
    get_origin,
    get_args,
    Annotated,
    Union,
    cast,
    NamedTuple,
)

import strawberry.experimental.pydantic
from annotated_types import Gt, Ge, Lt, Le
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django_stubs_ext import StrOrPromise
from faker.proxy import Faker
from graphql.pyutils import snake_to_camel
from pydantic import BaseModel, PositiveInt, TypeAdapter

from lebenslaeufe_app.app_based_registry import AppBasedRegistry


def _get_raw_type(type_: Any) -> tuple[Any, bool]:
    origin = get_origin(type_)
    if origin is None:
        return type_, type_ is None
    elif origin is Annotated:
        return _get_raw_type(get_args(type_)[0])
    elif origin is Union or origin is UnionType:
        args = get_args(type_)
        no_none = [arg for arg in args if arg is not NoneType]
        has_none = len(no_none) != len(args)
        if has_none and len(no_none) == 1:
            return no_none[0], True

    raise NotImplementedError(f'Unsupported type in Paradata value: {type_}')


def create_model_fakery(model: type[BaseModel]) -> Callable[[Faker], Any]:
    field_fakers = [
        (
            field_name,
            create_type_fakery(field_info.annotation, tuple(field_info.metadata)),
        )
        for field_name, field_info in model.model_fields.items()
    ]

    def fake_model(fake: Faker) -> Any:
        vals = {
            field_name: field_faker(fake) for field_name, field_faker in field_fakers
        }
        return model(**vals)

    return fake_model


@functools.cache
def create_type_fakery(
    type_: type, metadata: Collection[Any] | None = None
) -> Callable[[Faker], Any]:
    real_type, nullable = _get_raw_type(type_)
    if real_type is None or real_type is NoneType:
        return lambda _: None
    elif nullable:
        base_fakery = create_type_fakery(real_type)
        return lambda fake: base_fakery(fake) if fake.boolean() else None
    elif issubclass(real_type, BaseModel):
        return create_model_fakery(real_type)
    elif issubclass(real_type, enum.Enum):
        return lambda fake: fake.enum(real_type)
    elif issubclass(real_type, bool):
        return lambda fake: fake.boolean()
    elif issubclass(real_type, str):
        return lambda fake: fake.text(max_nb_chars=100)
    elif issubclass(real_type, int):
        min_ = 0
        max_ = 9999
        if metadata:
            for m in metadata:
                if isinstance(m, Gt):
                    min_ = cast(int, m.gt) + 1
                elif isinstance(m, Ge):
                    min_ = m.ge
                elif isinstance(m, Lt):
                    max_ = cast(int, m.lt) - 1
                elif isinstance(m, Le):
                    max_ = m.le
        return lambda fake: fake.random_int(min=min_, max=max_)
    else:
        raise NotImplementedError(f"Can't fake {type_} automatically.")


class ParadataFieldDefinition(NamedTuple):
    name: str
    """
    The name of this field.
    """
    dehydrate: Callable[[Any], str]
    """
    A callable to go from the root Paradata value to the string representation of this field.
    """


def get_type_subfields(
    type_: type, prefix: str = '', dehydrate_prefix: Callable[[Any], Any] | None = None
) -> Iterable[ParadataFieldDefinition]:
    if issubclass(type_, BaseModel):
        for f_name, f_info in type_.model_fields.items():
            get_field = operator.attrgetter(f_name)
            if dehydrate_prefix:
                plain_get_field = get_field

                def get_field_with_prefix(v):
                    return plain_get_field(dehydrate_prefix(v))

                get_field = get_field_with_prefix
            yield from get_type_subfields(
                _get_raw_type(f_info.annotation)[0], f'{prefix}_{f_name}', get_field
            )
    else:
        if issubclass(type_, Enum):
            base_to_str = operator.attrgetter('name')
        elif issubclass(type_, bool):

            def base_to_str(v):
                return str(int(v))
        else:
            base_to_str = str
        if dehydrate_prefix:
            plain_to_str = base_to_str

            def base_to_str_with_prefix(v):
                return plain_to_str(dehydrate_prefix(v))

            base_to_str = base_to_str_with_prefix
        yield ParadataFieldDefinition(prefix, base_to_str)


@dataclass(frozen=True)
class ParadataDefinition:
    key: str
    name: str
    client_side: bool
    value_type: type
    fake_factory: Callable[[Faker], Any] | None = None
    value_adapter: TypeAdapter = field(init=False, repr=False)

    def __post_init__(self):
        object.__setattr__(self, 'value_adapter', TypeAdapter(self.value_type))

    def build_graphql_type(self):
        if issubclass(self.value_type, BaseModel):
            dynamic_type = type(f'Paradata{snake_to_camel(self.key)}Value', (), {})
            return strawberry.experimental.pydantic.input(
                self.value_type, all_fields=True
            )(dynamic_type)
        elif issubclass(self.value_type, enum.Enum):
            return strawberry.enum(self.value_type)
        elif self.value_type is NoneType:
            raise ValueError(
                f'Paradata {self.key}, produced by the client, must have a value,'
                f' so it can exist in GraphQL.'
            )
        else:
            return self.value_type

    def value_to_db(self, raw_value: Any) -> Any:
        value = self.value_adapter.validate_python(raw_value, from_attributes=True)
        return self.value_adapter.dump_python(value, mode='json')

    @functools.cached_property
    def export_fields(self) -> Sequence[ParadataFieldDefinition]:
        """
        Get the fields that should be exported from this Paradata definition.
        :return:
        """
        return tuple(get_type_subfields(self.value_type))

    def fake_value(self, fake: Faker) -> Any:
        if self.fake_factory is not None:
            return self.fake_factory(fake)
        else:
            return create_type_fakery(self.value_type)(fake)


class ParadataRegistry(AppBasedRegistry[ParadataDefinition]):
    app_module_name = 'paradata'

    def register(
        self,
        key: str,
        name: StrOrPromise,
        client_side: bool,
        value_type: type,
        *,
        fake_factory: Callable[[Faker], Any] | None = None,
    ) -> None:
        self._register_internal(
            key, ParadataDefinition(key, name, client_side, value_type, fake_factory)
        )


PARADATA_REGISTRY = ParadataRegistry()


class WindowSize(BaseModel):
    width: PositiveInt
    height: PositiveInt


class ScreenOrientation(enum.StrEnum):
    PORTRAIT = 'portrait'
    LANDSCAPE = 'landscape'


class UserDataChange(BaseModel):
    email: bool = False
    address: bool = False
    phone: bool = False


class LoginType(enum.Enum):
    GUEST = 'guest'
    LOGIN = 'login'


PARADATA_EVENT_LOGIN = 'login'
PARADATA_EVENT_HAS_ACCOUNT = 'has_account'
PARADATA_EVENT_CHANGE_USER_DATA = 'user_data_change'
PARADATA_EVENT_REACHED_END_PAGE = 'reached_end_page'


@receiver(PARADATA_REGISTRY.register_signal, dispatch_uid='lla.builtin_paradata')
def builtin_paradata(registry: ParadataRegistry, **_kwargs):
    registry.register('focus', _('Tab im Fokus'), True, bool)
    registry.register(
        'user_agent',
        _('User Agent'),
        True,
        str,
        fake_factory=lambda fake: fake.user_agent(),
    )
    registry.register('window_size', _('Fenstergröße'), True, WindowSize)
    registry.register(
        'orientation', _('Bildschirmorientierung'), True, ScreenOrientation
    )
    registry.register(
        PARADATA_EVENT_CHANGE_USER_DATA,
        _('Benutzerdaten geändert'),
        False,
        UserDataChange,
    )
    registry.register(PARADATA_EVENT_LOGIN, _('Login'), False, LoginType)
    registry.register(PARADATA_EVENT_HAS_ACCOUNT, _('Account angelegt'), False, bool)
    registry.register(
        PARADATA_EVENT_REACHED_END_PAGE, _('Endseite erreicht'), False, NoneType
    )
