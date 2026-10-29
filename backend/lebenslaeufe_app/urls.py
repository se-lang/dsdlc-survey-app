"""
URL configuration for lebenslaeufe_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from debug_toolbar.toolbar import debug_toolbar_urls
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

from lla_translations.views import TranslationView
from .first_install import FirstSetupView, FIRST_INSTALL_URL_NAME
from .graphql_view import CustomGraphQLView
from .graphql_schema import create_schema

urlpatterns = [
    path('first-setup/', FirstSetupView.as_view(), name=FIRST_INSTALL_URL_NAME),
    path('api/admin/', admin.site.urls),
    path('api/i18n/', include('django.conf.urls.i18n')),
    path(
        'api/graphql/',
        CustomGraphQLView.as_view(schema=create_schema(), graphql_ide='apollo-sandbox'),
    ),
    path('api/translations/', TranslationView.as_view()),
    path('', RedirectView.as_view(pattern_name='admin:index')),
    path('api/', RedirectView.as_view(pattern_name='admin:index')),
    *debug_toolbar_urls(),
] + settings.LLA_CONFIG.storage.extra_urls()
