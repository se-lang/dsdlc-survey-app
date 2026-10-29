class ZofarException(Exception):
    pass


class NoZofarToken(ZofarException):
    pass


class NoZofarPageState(ZofarException):
    pass


class ZofarApiException(ZofarException):
    pass
