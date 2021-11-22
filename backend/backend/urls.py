#
#  Copyright Jim Carty © 2021: cartyjim1@gmail.com
#
#  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
#

from django.contrib import admin
from django.urls import path, re_path
from django.views.static import serve
from rest_framework_simplejwt.views import TokenRefreshView

from . import views
from . import settings

NAMESPACE = 'api'

urlpatterns = [
	path(NAMESPACE + '/admin/', admin.site.urls, name="admin-page"),

	path(NAMESPACE + '/', views.TestView.as_view(), name="api-test"),
	
	path(NAMESPACE + '/auth/login/', views.LoginView.as_view(), name="authentication-login"),
	path(NAMESPACE + '/auth/register/', views.RegisterView.as_view(), name="authentication-register"),
	path(NAMESPACE + '/auth/refresh_tokens/', TokenRefreshView.as_view(), name="authentication-refresh"),

	path('', views.FrontendView.as_view(), name="frontend-home"),
	path('other', views.FrontendView.as_view(), name="frontend-other"),
	path('login', views.FrontendView.as_view(), name="frontend-login"),

	re_path(r'^api/media/(?P<path>.*)$', serve, name="media-paths", kwargs={'document_root': settings.MEDIA_ROOT})
]
