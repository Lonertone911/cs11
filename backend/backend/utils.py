#
#  Copyright Jim Carty © 2021: cartyjim1@gmail.com
#
#  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
#

import enum

from rest_framework_simplejwt.tokens import RefreshToken

class STATUS_CODE_2xx(enum.Enum):
	SUCCESS = 200
	CREATED = 201
	ACCEPTED = 202
	NO_CONTENT = 204

class STATUS_CODE_4xx(enum.Enum):
	BAD_REQUEST = 400
	UNAUTHORIZED = 401
	FORBIDDEN = 403
	NOT_FOUND = 404
	GONE = 410

class STATUS_CODE_5xx(enum.Enum) :
	INTERNAL_SERVER_ERROR = 500

def get_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)

	return {
		'refresh' : str(refresh),
		'access' : str(refresh.access_token)
	}

def is_secret_key_valid(secret_key) :
	if secret_key == "123" or secret_key == "test_key" :
		return True

	return False