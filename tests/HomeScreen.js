import React from 'react';
import { shallow } from 'enzyme';
import HomeScreen from '../screens/HomeScreen';

describe('Test', () => {
  it('On component did mount', () => {
    const wrapper = shallow(<HomeScreen />);
    expect(wrapper.props.navigation.params.createNewShopList).not.toBeNull();
  });
});
