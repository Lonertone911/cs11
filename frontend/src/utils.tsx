/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import axios, { AxiosResponse } from 'axios';
import { ok, err, Result } from 'neverthrow';
import React, { ReactElement } from 'react';

import config from './config';

/* Authentication headers strings for internal REST call authentication */
interface AuthenticationHeaders {
	headers: {
		Authorization: string
	}
}

/* Alert bar updater type that allows errors to persist across pages */
export interface AlertBarUpdater {
	show: boolean,
	message: string | ReactElement,
	variant: string
}

/* General props inherited by all pages from App.tsx */
export interface PageProps {
	updateAlertBar: (message: string | ReactElement, variant: string, show: boolean) => Promise<void>,
	alert: AlertBarUpdater, // only added as App.tsx's state is destructed and this is included as it is a psuedo-global set of value so that the alertbar can be shared across multiple pages
}

/* JWT Tokens types */
export interface Tokens {
	access: string,
	refresh: string
}

/* Local storage type */
export interface LStorage {
	tokens: Tokens,
	username: string
}

/* Internal refresh token types */
interface RefreshTokensRESTSubmit {
	refresh: string
}

interface RefreshTokensREST {
	access: string
}

/* Authentication REST types */
export interface TokenREST {
	username: string,
	tokens: Tokens
}

export const loginRESTLink: string = '/auth/login/';
export interface LoginRESTSubmit {
	username: string,
	password: string,
}

export const registrationRESTLink: string = '/auth/register/';
export interface RegistrationRESTSubmit extends LoginRESTSubmit {
	secret_key: string
}

/* Objects returned by errors in the REST calls */
export interface RESTError {
	message: string | ReactElement,
	type: string,
	status: number,
	statusText: string
}

/* React Function component for generating error message text */
interface ErrorMessageTextProps extends RESTError { }
const ErrorMessageText: React.FC<ErrorMessageTextProps> = ({ statusText, message }) => {
	return (
		<React.Fragment>
			<strong>{statusText}</strong>: {message}
		</React.Fragment>
	);
}

/* Message returned when neither new refresh tokens can be retrieved, nor the API can be successfully reached */
const UnreachableErrorMessage: string = "API is not successfully accessible. Please re-login and try again, otherwise, please contact support";

/* JWT Access token refresh function that is called whenever the access token expires */
async function getNewAccessToken(): Promise<boolean> {
	try {
		const tokens: Tokens = JSON.parse(localStorage.tokens);

		if (tokens.refresh !== "") {
			const data: RefreshTokensRESTSubmit = {
				refresh: tokens.refresh
			};

			const result: Result<RefreshTokensREST, RESTError> = await resolvePOSTCall<RefreshTokensREST, RefreshTokensRESTSubmit>('/auth/refresh_tokens/', data, false, true);

			result
				.map(res => {
					tokens.access = res.access;
					localStorage.setItem("tokens", JSON.stringify(tokens));

					return null; // necessary to silence warning
				})
				.mapErr(err => {
					console.error(err.message);
				});

			return true;
		}

		return false;
	} catch (error) {
		return false;
	}
}

/* Helper function for making RESTful GET/retrieval calls */
export async function resolveGETCall<MessageT>(address: string, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, RESTError>> {
	try {
		var res: AxiosResponse<MessageT>;

		if (!authentication) {
			res = await axios.get<MessageT>(config.apiURL + address);
		} else {
			const tokens: Tokens = JSON.parse(localStorage.tokens);
			const headers: AuthenticationHeaders = { headers: { "Authorization": `Bearer ${tokens.access}` } };
			res = await axios.get<MessageT>(config.apiURL + address, headers);
		}

		return ok(res.data);
	} catch (error) {
		if (recursiveCall) {
			var retErr: RESTError;
			const hasResponseMessage: boolean = error.response && error.response.data && error.response.data.message;

			retErr = {
				message: hasResponseMessage ? error.response.data.message : error.message,
				type: hasResponseMessage ? "RESTError" : error.name,
				status: hasResponseMessage ? error.response.status : 401,
				statusText: hasResponseMessage ? error.response.statusText : "Unauthorized"
			};

			retErr.message = <ErrorMessageText {...retErr} />;

			return err(retErr);
		}

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolveGETCall<MessageT>(address, authentication, true);
		}

		const unreachableErr: RESTError = {
			message: UnreachableErrorMessage,
			type: "RESTError",
			status: 403,
			statusText: "Forbidden"
		};
		return err(unreachableErr);
	}
}

/* Helper function for making RESTful POST/creation calls */
export async function resolvePOSTCall<MessageT, PayloadT>(address: string, data: PayloadT, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, RESTError>> {
	try {
		var res: AxiosResponse<MessageT>;

		if (!authentication) {
			res = await axios.post<MessageT>(config.apiURL + address, data);
		} else {
			const tokens: Tokens = JSON.parse(localStorage.tokens);
			const headers: AuthenticationHeaders = { headers: { "Authorization": `Bearer ${tokens.access}` } };
			res = await axios.post<MessageT>(config.apiURL + address, data, headers);
		}

		return ok(res.data);
	} catch (error) {
		if (recursiveCall) {
			var retErr: RESTError;
			const hasResponseMessage: boolean = error.response && error.response.data && error.response.data.message;

			retErr = {
				message: hasResponseMessage ? error.response.data.message : error.message,
				type: hasResponseMessage ? "RESTError" : error.name,
				status: hasResponseMessage ? error.response.status : 401,
				statusText: hasResponseMessage ? error.response.statusText : "Unauthorized"
			};

			retErr.message = <ErrorMessageText {...retErr} />;

			return err(retErr);
		}

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolvePOSTCall<MessageT, PayloadT>(address, data, authentication, true);
		}

		const unreachableErr: RESTError = {
			message: UnreachableErrorMessage,
			type: "RESTError",
			status: 403,
			statusText: "Forbidden"
		};
		return err(unreachableErr);
	}
}

/* Helper function for making RESTful PUT/update calls */
export async function resolvePUTCall<MessageT, PayloadT>(address: string, data: PayloadT, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, RESTError>> {
	try {
		var res: AxiosResponse<MessageT>;

		if (!authentication) {
			res = await axios.put<MessageT>(config.apiURL + address, data);
		} else {
			const tokens: Tokens = JSON.parse(localStorage.tokens);
			const headers: AuthenticationHeaders = { headers: { "Authorization": `Bearer ${tokens.access}` } };
			res = await axios.put<MessageT>(config.apiURL + address, data, headers);
		}

		return ok(res.data);
	} catch (error) {
		if (recursiveCall) {
			var retErr: RESTError;
			const hasResponseMessage: boolean = error.response && error.response.data && error.response.data.message;

			retErr = {
				message: hasResponseMessage ? error.response.data.message : error.message,
				type: hasResponseMessage ? "RESTError" : error.name,
				status: hasResponseMessage ? error.response.status : 401,
				statusText: hasResponseMessage ? error.response.statusText : "Unauthorized"
			};

			retErr.message = <ErrorMessageText {...retErr} />;

			return err(retErr);
		}

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolvePUTCall<MessageT, PayloadT>(address, data, authentication, true);
		}

		const unreachableErr: RESTError = {
			message: UnreachableErrorMessage,
			type: "RESTError",
			status: 403,
			statusText: "Forbidden"
		};
		return err(unreachableErr);
	}
}

/* Helper function for making RESTful DELETE calls */
export async function resolveDELETECall<MessageT>(address: string, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, RESTError>> {
	try {
		var res: AxiosResponse<MessageT>;

		if (!authentication) {
			res = await axios.delete<MessageT>(config.apiURL + address);
		} else {
			const tokens: Tokens = JSON.parse(localStorage.tokens);
			const headers: AuthenticationHeaders = { headers: { "Authorization": `Bearer ${tokens.access}` } };
			res = await axios.delete<MessageT>(config.apiURL + address, headers);
		}

		return ok(res.data);
	} catch (error) {
		if (recursiveCall) {
			var retErr: RESTError;
			const hasResponseMessage: boolean = error.response && error.response.data && error.response.data.message;

			retErr = {
				message: hasResponseMessage ? error.response.data.message : error.message,
				type: hasResponseMessage ? "RESTError" : error.name,
				status: hasResponseMessage ? error.response.status : 401,
				statusText: hasResponseMessage ? error.response.statusText : "Unauthorized"
			};

			retErr.message = <ErrorMessageText {...retErr} />;

			return err(retErr);
		}

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolveDELETECall<MessageT>(address, authentication, true);
		}

		const unreachableErr: RESTError = {
			message: UnreachableErrorMessage,
			type: "RESTError",
			status: 403,
			statusText: "Forbidden"
		};
		return err(unreachableErr);
	}
}