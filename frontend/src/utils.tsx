/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import axios, { AxiosResponse } from 'axios';
import { ok, err, Result } from 'neverthrow';

import config from './config';

interface AuthenticationHeaders {
	headers: {
		Authorization: string
	}
}

export interface AlertBarUpdater {
	show: boolean,
	message: string,
	variant: string
}

export interface PageProps {
	updateAlertBar: (message: string, variant: string, show: boolean) => Promise<void>,
	alert: AlertBarUpdater, // only added as App.tsx's state is destructed and this is included as it is a psuedo-global set of value so that the alertbar can be shared across multiple pages
}

export interface Tokens {
	access: string,
	refresh: string
}

export interface LStorage {
	tokens: Tokens,
	username: string
}

interface RefreshTokensRESTSubmit {
	refresh: string
}

interface RefreshTokensREST {
	access: string
}

async function getNewAccessToken(): Promise<boolean> {
	try {
		const tokens: Tokens = JSON.parse(localStorage.tokens);

		if (tokens.refresh !== "") {
			const data: RefreshTokensRESTSubmit = {
				refresh: tokens.refresh
			};

			const result: Result<RefreshTokensREST, Error> = await resolvePOSTCall<RefreshTokensREST, RefreshTokensRESTSubmit>('/auth/refresh_tokens/', data);

			result
				.map(res => {
					tokens.access = res.access;
					localStorage.setItem("tokens", JSON.stringify(tokens));

					return null; // necessary to silence warning
				})
				.mapErr(err => {
					console.error(err);
				});

			return true;
		}

		return false;
	} catch (error) {
		return false;
	}
}

export async function resolveGETCall<MessageT>(address: string, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, Error>> {
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
		if (recursiveCall)
			return err(error);

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolveGETCall<MessageT>(address, authentication, true);
		}

		return err(error);
	}
}

export async function resolvePOSTCall<MessageT, PayloadT>(address: string, data: PayloadT, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, Error>> {
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
		if (recursiveCall)
			return err(error);

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolvePOSTCall<MessageT, PayloadT>(address, data, authentication, true);
		}

		return err(error);
	}
}

export async function resolvePUTCall<MessageT, PayloadT>(address: string, data: PayloadT, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, Error>> {
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
		if (recursiveCall)
			return err(error);

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolvePUTCall<MessageT, PayloadT>(address, data, authentication, true);
		}

		return err(error);
	}
}

export async function resolveDELETECall<MessageT>(address: string, authentication: boolean = false, recursiveCall: boolean = false): Promise<Result<MessageT, Error>> {
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
		if (recursiveCall)
			return err(error);

		const successfullyGotNewAccess: boolean = await getNewAccessToken();

		if (successfullyGotNewAccess) {
			return await resolveDELETECall<MessageT>(address, authentication, true);
		}

		return err(error);
	}
}