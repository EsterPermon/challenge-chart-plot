import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import UserInput from './UserInput';
import Editor from "react-simple-code-editor";

configure({adapter: new Adapter()});

describe('<UserInput />', () => {  

  it('should render Editor', () => {
    const wrapper = shallow(<UserInput />);
    expect(wrapper.find(Editor)).toHaveLength(1);
  });
});