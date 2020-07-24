import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Footer from './Footer';

configure({adapter: new Adapter()});

describe('<Footer />', () => {
  
  it('should disable button when property disable is true', () => {
    const mockOnClick = jest.fn();
    const wrapper = shallow(<Footer disable={true}/>);
      wrapper.find('.chart-button').simulate('click');
      expect(mockOnClick).toHaveBeenCalledTimes(0);
  });
 
  it('should call generateChartHandler when clicked', () => {
    const generateChartHandler = jest.fn();
    const props = {
      disabled:  false,
      clicked: generateChartHandler
    }
    const wrapper = shallow(<Footer {...props} />);
      wrapper.find('.chart-button').simulate('click');
      expect(props.clicked).toHaveBeenCalledTimes(1);
  });
});