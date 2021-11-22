/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/


import React from 'react';

import { Col, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { PageProps } from '../utils';

import BasePage from './elements/BasePage';

import './OtherView.css';

export interface OtherViewProps extends RouteComponentProps, PageProps { }

interface State { }

export class OtherView extends React.Component<OtherViewProps, State> {
	render() {
		return (
			<React.Fragment>
				<BasePage {...this.props}>

					<Row>
						<Col>
							Other page
						</Col>
					</Row>

				</BasePage>
			</React.Fragment>
		);
	}
}