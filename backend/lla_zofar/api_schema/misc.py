from typing import Literal

from lla_zofar.api_schema.base import ZfParentElement


class ZfPictureBar(ZfParentElement):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.common.PictureBar'
    ]


class ZfUiSort(ZfParentElement):
    type: Literal['de.his.zofar.presentation.surveyengine.ui.components.common.UISort']


class ZfDisplayContainer(ZfParentElement):
    type: Literal[
        'de.his.zofar.presentation.surveyengine.ui.components.display.UIDisplayContainer'
    ]
