import React from 'react';
import { shallow } from 'enzyme';
import AddTagCard from '../src/components/AddTagCard';

describe('AddTagCard', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<AddTagCard onTagCreated={() => {}} />);
    expect(wrapper.exists()).toBe(true);
  });

});
