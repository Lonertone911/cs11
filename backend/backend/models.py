#
#  Copyright Jim Carty © 2021: cartyjim1@gmail.com
#
#  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
#

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
	username = models.CharField(max_length=128, unique=True, primary_key=True, db_index=True)

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []
	
	def __str__(self) :
		return self.username
