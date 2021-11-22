#
#  Copyright Jim Carty © 2021: cartyjim1@gmail.com
#
#  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
#

from django.contrib import admin
from django.urls import path, re_path
from django.views.static import serve

from backend.views import FrontendHomeView, FrontendOtherView
from . import settings

NAMESPACE = 'api/'

urlpatterns = [
    path(NAMESPACE + 'admin/', admin.site.urls),

	path('', FrontendHomeView.as_view()),
	path('other/', FrontendHomeView.as_view()),

	re_path(r'^api/media/(?P<path>.*)$', serve, kwargs={'document_root': settings.MEDIA_ROOT})
]
