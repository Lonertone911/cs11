/*
  Copyright Jim Carty © 2021: cartyjim1@gmail.com

  This file is subject to the terms and conditions defined in file 'LICENSE.txt', which is part of this source code package.
*/

import * as React from 'react';

import { mount, shallow } from 'enzyme';

import { OtherView, OtherViewProps } from './OtherView';
import { MemoryRouter as Router } from 'react-router';

describe('OtherView', () => {
	const getProps = (): OtherViewProps => (
		{
			history: {} as any,
			location: {} as any,
			match: {} as any,
			updateAlertBar: async () => { },
			alert: {} as any
		}
	)

	const getComponent = (props: OtherViewProps) => (
		<OtherView {...props} />
	);


	it('Should render correctly with shallow', () => {
		const component = shallow(
			getComponent(getProps())
		);
		expect(component.debug()).toMatchSnapshot();
	});

	it('Should render correctly with mount', () => {
		// have to include router as will fail with react-router problem due to use of specific functions
		const component = mount(
			<Router>
				{getComponent(getProps())}
			</Router>
		);
		expect(component.debug()).toMatchSnapshot();
	});
});