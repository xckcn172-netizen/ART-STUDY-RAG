from fastapi import Depends
from typing import Annotated
from .core.config import settings


async def get_settings():
    """
    Get application settings
    """
    return settings


SettingsDep = Annotated[settings.__class__, Depends(get_settings)]
