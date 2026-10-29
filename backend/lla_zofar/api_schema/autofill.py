from pydantic import BaseModel, HttpUrl, Field


class AutofillMeta(BaseModel):
    version: str
    language: str


class AutofillDataItem(BaseModel):
    label: str
    value: str


class AutofillData(BaseModel):
    meta: AutofillMeta
    options: list[AutofillDataItem]


class AutofillReference(BaseModel):
    url: HttpUrl
    list_id: str = Field(validation_alias='listId')
    language: str = Field()
    version: str = Field()
