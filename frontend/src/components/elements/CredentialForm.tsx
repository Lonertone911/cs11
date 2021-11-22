import React, { ReactElement } from 'react';

import { Result } from 'neverthrow';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router';

import { TokenREST, RegistrationRESTSubmit, resolvePOSTCall, resolvePUTCall, PageProps, loginRESTLink, registrationRESTLink, RESTError } from '../../utils';

import './CredentialForm.css';

interface Props extends RouteComponentProps, PageProps { }

interface State extends RegistrationRESTSubmit {
	register: boolean,
}

export default class LoginForm extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);

		this.state = {
			username: "",
			password: "",
			register: false,
			secret_key: ""
		};
	}

	handlSubmitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const data: RegistrationRESTSubmit = {
			username: this.state.username,
			password: this.state.password,
			secret_key: this.state.secret_key
		};

		var result: Result<TokenREST, RESTError>;
		if (this.state.register)
			result = await resolvePOSTCall<TokenREST, RegistrationRESTSubmit>(registrationRESTLink, data);
		else
			result = await resolvePUTCall<TokenREST, RegistrationRESTSubmit>(loginRESTLink, data);

		result
			.map(res => {
				localStorage.setItem("tokens", JSON.stringify(res.tokens));
				localStorage.setItem("username", res.username);

				this.props.updateAlertBar("Successfully logged in!", "success", true);

				this.props.history.push('/');

				return null; // necessary to silence warning
			})
			.mapErr(err => {
				var message: string | ReactElement;

				if (err.type === "Error")
					message = "Internal server error, please retry in a couple minutes";
				else
					message = err.message;

				this.props.updateAlertBar(message, "danger", true);
			});
	}

	render() {
		return (
			<React.Fragment>
				<Form onSubmit={this.handlSubmitLogin}>
					<Form.Group className="mb-3" controlId="username">
						<Form.Label>username</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder="Username"
							value={this.state.username}
							onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ username: event.target.value }) }} />
					</Form.Group>

					<Form.Group className="mb-3" controlId="password">
						<Form.Label>password</Form.Label>
						<Form.Control
							required
							type="password"
							placeholder="Password"
							value={this.state.password}
							onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ password: event.target.value }) }} />
					</Form.Group>

					{this.state.register &&
						<React.Fragment>
							<Form.Group className="mb-3" controlId="secret_key">
								<Form.Label>secret key</Form.Label>
								<Form.Control
									required
									type="text"
									placeholder="SECRET-12SBKA678"
									value={this.state.secret_key}
									onChange={async (event: React.ChangeEvent<HTMLInputElement>) => { this.setState({ secret_key: event.target.value }) }} />
							</Form.Group>
						</React.Fragment>
					}

					<Row>
						<Col>
							<Button className="styled-btn" variant="outline-dark" type="submit">
								{this.state.register ? "Register" : "Log in"}
							</Button>
						</Col>
						<Col>
							<Button className="styled-btn" onClick={() => this.setState(prev => ({ register: !prev.register }))} variant="outline-dark" style={{ float: "right" }}>
								{this.state.register ? "Already registered?" : "Not signed up?"}
							</Button>
						</Col>
					</Row>
				</Form>
			</React.Fragment>
		);
	}
}