#
#  Copyright Jim Carty © 2021: cartyjim1@gmail.com
#
#  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
#

import json
import traceback

from django.contrib.auth import authenticate
from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from backend.models import User
from backend.utils import (
	get_tokens_for_user,
	is_secret_key_valid,
	STATUS_CODE_2xx,
	STATUS_CODE_4xx,
	STATUS_CODE_5xx
)
from backend.serealizers import RegisterUserSerializer

# API views
class TestView(APIView):
	def get(self, request):
		return Response({"blah" : "foo"}, status=STATUS_CODE_2xx.SUCCESS.value)

class RegisterView(APIView):
	def post(self, request) :
		try :
			req = json.loads(request.body.decode('utf-8'))

			if not is_secret_key_valid(req["secret_key"]) :
				return Response({"message": "Secret key is not valid, please verify it your teacher or YES representative"}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

			serealizer = RegisterUserSerializer(data=req)
			
			if not serealizer.is_valid() :
				errors = []

				if "username" in serealizer.errors :
					errors += list(serealizer.errors["username"])
				if "non_field_errors" in serealizer.errors : 
					# if errors in password, index is strange due to django
					errors = list(serealizer.errors["non_field_errors"])
					
				message = ", and ".join([str(err).lower()[:-1] if i != 0 else str(err)[:-1] for i, err in enumerate(errors)])
				return Response({"message": message}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

			serealizer.save()

			ret_user = User.objects.get(username=req["username"])

			tokens = get_tokens_for_user(ret_user)

			return Response({
				"tokens" : tokens,
				"username" : ret_user.username
			}, status=STATUS_CODE_2xx.CREATED.value)
		
		except Exception :
			traceback.print_exc()
			return Response({"message" : "User could not be created, please try again later"}, status=STATUS_CODE_4xx.BAD_REQUEST.value)

class LoginView(APIView):
	def put(self, request) :
		try :
			req = json.loads(request.body.decode('utf-8'))

			try:
				User.objects.get(username=req['username'])
			except Exception :
				return Response({"message" : "User with supplied username does not exist, please register before logging in"}, status=STATUS_CODE_4xx.BAD_REQUEST.value)
			
			user = authenticate(username=req['username'], password=req['password'])

			if user :
				tokens = get_tokens_for_user(user)
				return Response({
					"tokens" : tokens,
					"username" : user.username
				}, status=STATUS_CODE_2xx.ACCEPTED.value)

			else :
				return Response({"message" : "Incorrect authentication details supplied, please ensure that the correct password was entered"}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)

		except Exception :
			traceback.print_exc()
			return Response({"message" : "Incorrect authentication details supplied, please ensure that the correct password was entered"}, status=STATUS_CODE_4xx.UNAUTHORIZED.value)





# Frontend View
class FrontendView(APIView) :
	def get(self, request):
		return render(request, 'index.html')