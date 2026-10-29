from typing import Literal, TYPE_CHECKING


from lla_zofar.api_schema.base import ZfParentElement

if TYPE_CHECKING:
    pass


ZfButtonElementType = Literal[
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.LogoutButton',
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.Jumper',
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.DefaultButton',
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.AbstractButton',
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.ReloadButton',
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.ButtonPanel',
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.JumperContainer',
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.ForwardButton',
    'de.his.zofar.presentation.surveyengine.ui.components.buttons.BackwardButton',
]


class ZfButtonElement(ZfParentElement):
    type: ZfButtonElementType
