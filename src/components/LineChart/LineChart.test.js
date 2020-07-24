import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LineChart from './LineChart';
import { Vega } from 'react-vega';

configure({adapter: new Adapter()});

describe('<LineChart />', () => {
  const wrapper = shallow(<LineChart />);
  
  it('should render Vega Chart', () => {
    expect(wrapper.find(Vega)).toHaveLength(1);
  });
});