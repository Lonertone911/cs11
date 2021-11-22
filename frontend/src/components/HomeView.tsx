/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import { Col, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { PageProps } from '../utils';

import BasePage from './elements/BasePage';

import './HomeView.css';

export interface HomeViewProps extends RouteComponentProps, PageProps { }

interface State { }

export class HomeView extends React.Component<HomeViewProps, State> {
	render() {
		return (
			<React.Fragment>
				<BasePage {...this.props}>

					<Row>
						<Col>
							Home page
						</Col>
					</Row>

				</BasePage>
			</React.Fragment>
		);
	}
}