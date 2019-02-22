import React from 'react';
import { shallow } from 'enzyme';
import HomeScreen from '../presentation/views/HomeScreen';

const navigation = {
  navigate: jest.fn(),
  params: null,
  setParams: (params) => {
    this.params = params;
  },
};

describe('Test', () => {
  it('On component did mount', () => {
    const wrapper = shallow(<HomeScreen navigation={navigation} />);
    wrapper.update();
    console.log(wrapper.instance().props.navigation.params);

    expect(wrapper.instance().props.navigation.params.createNewShopList).toBeDefined();
  });
});
