/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React, { ReactElement } from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { HomeView } from './components/HomeView';
import { LoginView } from './components/LoginView';
import { OtherView } from './components/OtherView';

import { AlertBarUpdater, PageProps, Tokens } from './utils';

import './App.css';

interface Props { }

interface State extends PageProps { }

export default class App extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			"alert": {
				"show": false,
				"message": "No alert text",
				"variant": "success"
			},
			"updateAlertBar": this.updateAlertBar
		}
	}

	componentDidMount() {
		if (localStorage.getItem("tokens") === null) {
			const tokens: Tokens = {
				"access": "",
				"refresh": ""
			}

			localStorage.setItem("tokens", JSON.stringify(tokens));
		}

		if (localStorage.getItem("username") === null) {
			localStorage.setItem("username", "");
		}

		if (localStorage.getItem("theme") === null) {
			localStorage.setItem("theme", "light"); // by default light theme
			document.body.classList.add('light');
		} else {
			document.body.classList.add(localStorage.theme);
		}
	}

	updateAlertBar = async (message: string | ReactElement, variant: string, show: boolean) => {
		const updater: AlertBarUpdater = {
			"message": message,
			"variant": variant,
			"show": show
		};
		this.setState({ "alert": updater });
	}

	render() {
		return (
			<React.Fragment>
				<Router>
					<Switch>
						<Route exact path="/" render={(props) => <HomeView {...props} {...this.state} />} />
						<Route exact path="/other" render={(props) => <OtherView {...props} {...this.state} />} />
						<Route exact path="/login" render={(props) => <LoginView {...props} {...this.state} />} />
					</Switch>
				</Router>
			</React.Fragment>
		);
	}
}