import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Dashboard from './Dashboard';
import Toolbar from '../Toolbar/Toolbar';
import LineChart from '../LineChart/LineChart';
import Footer from '../Footer/Footer';
import UserInput from '../UserInput/UserInput';

configure({adapter: new Adapter()});

describe('<Dashboard />', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Dashboard />);
  });

  it('should render Toolbar', () => {
    expect(wrapper.find(Toolbar)).toHaveLength(1);
  });

  it('should render UserInput', () => {
    expect(wrapper.find(UserInput)).toHaveLength(1);
  });

  it('should render Footer', () => {
    expect(wrapper.find(Footer)).toHaveLength(1);
  });

  it('should not render chart while showChart is false', () => {
    expect(wrapper.find(LineChart)).toHaveLength(0);
  });

  it('should not render error paragraph when invalidInput is null', () => {
    expect(wrapper.find('.error')).toHaveLength(0);
  });
 
  it('should not render warning paragraph when ignoredInput is null', () => {
    expect(wrapper.find('.warning')).toHaveLength(0);
  });
});