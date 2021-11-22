/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import { Alert } from 'react-bootstrap';

import { PageProps } from '../../utils';

interface Props extends PageProps { };
interface State {
	"show": boolean
};

export default class AlertBar extends React.Component<Props, State> {
	async componentWillUnmount() {
		this.props.updateAlertBar("", "success", false);
	}

	handleClose = async () => {
		var currAlert = this.props.alert;
		currAlert.show = false;
		this.props.updateAlertBar(this.props.alert.message, this.props.alert.variant, this.props.alert.show);
	}

	render() {
		return (
			<React.Fragment>
				<Alert show={this.props.alert.show} variant={this.props.alert.variant} onClose={this.handleClose} dismissible>
					{this.props.alert.message}
				</Alert>
			</React.Fragment>
		);
	}
}