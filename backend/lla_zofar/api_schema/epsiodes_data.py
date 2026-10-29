from pydantic import BaseModel, ConfigDict, AliasGenerator, AwareDatetime
from pydantic.alias_generators import to_camel

from lla_zofar.api_schema.hex_color import HexColor


class ZfEpisodesPostData(BaseModel):
    model_config = ConfigDict(alias_generator=AliasGenerator(validation_alias=to_camel))

    id: int
    type: str
    type_color: HexColor
    name: str
    start_date: AwareDatetime
    end_date: AwareDatetime
