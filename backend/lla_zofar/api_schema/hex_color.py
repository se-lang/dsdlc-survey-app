import re
from re import RegexFlag
from typing import Annotated

from pydantic import Field

HexColor = Annotated[
    str,
    Field(
        pattern=re.compile(
            r'^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$', RegexFlag.IGNORECASE
        )
    ),
]
