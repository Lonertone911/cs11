/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import React from 'react';

import { PageProps } from '../../utils';

// import NavBar from './NavBar';
import AlertBar from './AlertBar';

import './BasePage.css';
import { Col, Container, Row } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

import PACKAGE_JSON from '../../../package.json';

interface Props extends PageProps { }
interface State { }

export default class BasePage extends React.PureComponent<Props, State> {
	toggleDarkMode = () => {
		localStorage.setItem('theme', localStorage.getItem('theme') === 'light' ? 'dark' : 'light');

		document.body.classList.replace(localStorage.getItem('theme') === 'light' ? 'dark' : 'light', localStorage['theme']);
	}

	render() {
		return (
			<React.Fragment>
				<div className="pagebody">
					{/* <img
						alt=''
						src={process.env.PUBLIC_URL + '/logo_main.png'}
						className='logo'
					/> */}
					{' '}
					{/* <NavBar /> */}

					{/* <div className='dark-mode-container' >
						<label className="switch">
							<input
								type="checkbox"
								onClick={this.toggleDarkMode}
								defaultChecked={localStorage.getItem('theme') !== null ? localStorage.getItem('theme') === 'dark' : false}
							/>
							<span className="slider round"></span>
						</label>
						<div style={{ display: 'inline-block', marginLeft: '10px' }}>
							<strong>Dark Mode</strong>
						</div>
					</div> */}

					<div className='mainbody'>
						<AlertBar {...this.props} />

						{this.props.children}
					</div>
				</div>

				<footer className='footer py-3 text-black'>
					<div />
					<Container>
						<Row>
							<Col>
								YES Business Simulation 2021 v{PACKAGE_JSON.version}
							</Col>
							{/* <Col>
								<div style={{ float: 'right' }}>
									<Link to='/support'>
										Support
									</Link>
								</div>
							</Col> */}
						</Row>
					</Container>
				</footer>
			</React.Fragment>
		)
	}
}