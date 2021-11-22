#
#  Copyright Jim Carty © 2021: cartyjim1@gmail.com
#
#  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
#

from django.shortcuts import render

from rest_framework.views import APIView

class FrontendHomeView(APIView) :
	def get(self, request):
		return render(request, 'index.html')

class FrontendOtherView(APIView) :
	def get(self, request):
		return render(request, 'index.html')