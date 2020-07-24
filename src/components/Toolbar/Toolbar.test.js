import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Toolbar from './Toolbar';

configure({adapter: new Adapter()});

describe('<Toolbar />', () => {
  const wrapper = shallow(<Toolbar />);

  it('App\'s title should be Ester\'s Challenge', () => {
    wrapper.setProps({title: 'Ester\'s Challenge'});
    expect(wrapper.contains(<h1>Ester's Challenge</h1>)).toEqual(true);
  });
});