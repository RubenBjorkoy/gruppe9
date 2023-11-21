import React from 'react';
import { shallow } from 'enzyme';
import Navigation from '../src/components/Navigation';

describe('Navigation', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Navigation />);
    expect(wrapper.exists()).toBe(true);
  });

});
