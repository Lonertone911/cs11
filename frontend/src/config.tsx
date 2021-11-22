/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

interface Config {
	apiURL: string,
}

const dev: Config = {
	apiURL: "http://localhost:8000/api",
}

const prod: Config = {
	apiURL: "/api",
};

const config: Config = process.env.REACT_APP_CONFIG === 'dev' ?
	dev : prod;

export default config;