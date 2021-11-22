#
#  Copyright Jim Carty © 2021: cartyjim1@gmail.com
#
#  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
#

import django.contrib.auth.password_validation as validators
import rest_framework.exceptions as exceptions

from . import models
from rest_framework import serializers

class RegisterUserSerializer(serializers.ModelSerializer):
	password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
	username = serializers.CharField(style={'input_type': 'username'}, write_only=True)

	class Meta:
		model = models.User
		fields = ('username', 'password')

	def validate(self, data):
		user = models.User(**data)

		password = data.get('password')
		username = data.get('username')

		errors = dict() 

		try:
			existing_users = models.User.objects.filter(username=username)
			if len(existing_users) != 0 :
				errors['username'] = ["User with username already exists."]
		
		except Exception as e: 
			pass # user does not already exit, therefore, success

		validators.validate_password(password=password, user=user)

		if errors:
			raise serializers.ValidationError(errors)

		return super(RegisterUserSerializer, self).validate(data)

	def create(self, validated_data):
		user = models.User.objects.create_user(**validated_data)
		user.save()
		return user