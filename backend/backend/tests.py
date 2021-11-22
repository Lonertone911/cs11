#
#  Copyright Jim Carty © 2021: cartyjim1@gmail.com
#
#  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
#

import json

from django.test import TestCase, Client
from django.urls import reverse

from backend.models import User
from backend.urls import NAMESPACE

NAMESPACE = '/' + NAMESPACE

TEST_SECRET_KEY = "test_key"

class UserRegistrationTestCase(TestCase):
	def setUp(self) :
		self.client = Client()
		User.objects.create(username='foo', password='foo')

	def test_user_registration_unsuccessful_similar_and_short_password(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "user1", "password" : "user1", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "The password is too similar to the username, and this password is too short. it must contain at least 6 characters")

	def test_user_registration_unsuccessful_short_password(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "user1", "password" : "foo", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "This password is too short. It must contain at least 6 characters")

	def test_user_registration_unsuccessful_similar_password(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "user12345", "password" : "user12345", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "The password is too similar to the username")

	def test_user_registration_unsuccessful_short_and_similar_and_common_password(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "admin", "password" : "admin", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "The password is too similar to the username, and this password is too short. it must contain at least 6 characters, and this password is too common")

	def test_user_registration_unsuccessful_common_password(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "admin", "password" : "password", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "This password is too common")

	def test_user_registration_unsuccessful_exisiting_username(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "foo", "password" : "dghjasdja^&*678", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "User with username already exists")

	def test_user_registration_unsuccessful_exisiting_username_and_common_password(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "foo", "password" : "password", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "This password is too common")

	def test_user_registration_unsuccessful_invalid_secret_key(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "bar", "password" : "dghjasdja^&*678", "secret_key": TEST_SECRET_KEY+"foo"}), content_type="application/json")
		self.assertEqual(response.status_code, 401)
		self.assertEqual(response.data['message'], "Secret key is not valid, please verify it your teacher or YES representative")

	def test_user_registration_successful(self):
		response = self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : "bar", "password" : "dghjasdja^&*678", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 201)
		self.assertTrue("username" in response.data)
		self.assertTrue("tokens" in response.data)
		self.assertTrue("access" in response.data['tokens'])
		self.assertTrue("refresh" in response.data['tokens'])
		self.assertGreater(len(response.data['tokens']['access']), 20)
		self.assertGreater(len(response.data['tokens']['refresh']), 20)

	def test_user_registration_incorrect_methods(self):
		response = self.client.put(NAMESPACE + '/auth/register/', json.dumps({"username" : "bar", "password" : "dghjasdja^&*678", "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 405)

		response = self.client.get(NAMESPACE + '/auth/register/')
		self.assertEqual(response.status_code, 405)

		response = self.client.delete(NAMESPACE + '/auth/register/')
		self.assertEqual(response.status_code, 405)

class UserLoginTestCase(TestCase) :
	def setUp(self):
		self.client = Client()
		self.TEST_USERNAME = "foo"
		self.TEST_PASSWORD = "gdsakdsja678687&^*"
		self.client.post(NAMESPACE + '/auth/register/', json.dumps({"username" : self.TEST_USERNAME, "password" : self.TEST_PASSWORD, "secret_key": TEST_SECRET_KEY}), content_type="application/json")

	def test_user_login_unsuccessful_incorrect_password(self) :
		response = self.client.put(NAMESPACE + '/auth/login/', json.dumps({"username" : self.TEST_USERNAME, "password" : self.TEST_PASSWORD+"1"}), content_type="application/json")
		self.assertEqual(response.status_code, 401)
		self.assertEqual(response.data['message'], "Incorrect authentication details supplied, please ensure that the correct password was entered")

	def test_user_login_unsuccessful_incorrect_username(self) :
		response = self.client.put(NAMESPACE + '/auth/login/', json.dumps({"username" : self.TEST_USERNAME+'1', "password" : self.TEST_PASSWORD}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "User with supplied username does not exist, please register before logging in")

	def test_user_login_unsuccessful_incorrect_username_and_password(self) :
		response = self.client.put(NAMESPACE + '/auth/login/', json.dumps({"username" : self.TEST_USERNAME+'1', "password" : self.TEST_PASSWORD+"1"}), content_type="application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data['message'], "User with supplied username does not exist, please register before logging in")

	def test_user_login_successful(self) :
		response = self.client.put(NAMESPACE + '/auth/login/', json.dumps({"username" : self.TEST_USERNAME, "password" : self.TEST_PASSWORD}), content_type="application/json")
		self.assertEqual(response.status_code, 202)
		self.assertTrue("username" in response.data)
		self.assertTrue("tokens" in response.data)
		self.assertTrue("access" in response.data['tokens'])
		self.assertTrue("refresh" in response.data['tokens'])
		self.assertGreater(len(response.data['tokens']['access']), 20)
		self.assertGreater(len(response.data['tokens']['refresh']), 20)

	def test_user_login_incorrect_methods(self):
		response = self.client.post(NAMESPACE + '/auth/login/', json.dumps({"username" : self.TEST_USERNAME, "password" : self.TEST_PASSWORD, "secret_key": TEST_SECRET_KEY}), content_type="application/json")
		self.assertEqual(response.status_code, 405)

		response = self.client.get(NAMESPACE + '/auth/login/')
		self.assertEqual(response.status_code, 405)

		response = self.client.delete(NAMESPACE + '/auth/login/')
		self.assertEqual(response.status_code, 405)

class FrontendTemplateTestCase(TestCase) :
	def setUp(self):
		self.client = Client()

	def test_home_view(self):
		url = reverse('frontend-home')
		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		self.assertTemplateUsed(response, 'index.html')
		self.assertContains(response, 'YES Business Simulation')

	def test_other_view(self):
		url = reverse('frontend-other')
		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		self.assertTemplateUsed(response, 'index.html')
		self.assertContains(response, 'YES Business Simulation')

	def test_login_view(self):
		url = reverse('frontend-login')
		response = self.client.get(url)
		self.assertEqual(response.status_code, 200)
		self.assertTemplateUsed(response, 'index.html')
		self.assertContains(response, 'YES Business Simulation')
