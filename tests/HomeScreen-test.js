import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  FlatList,
  Alert,
} from 'react-native';
import { shallow } from 'enzyme';
import HomeScreen from '../presentation/views/HomeScreen';

const navigation = {
  navigate: jest.fn(),
  params: [],
  setParams: function (params) {
    this.params = params;
  },
};

describe('Test', () => {

  let wrapper;

  beforeAll(() => {
    wrapper = shallow(<HomeScreen navigation={navigation} />);
  });

  it('On component did mount', () => {
    const spy = jest.spyOn(wrapper.instance(), 'requestData');
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().props.navigation.params.createNewShopList).toBeDefined();
    expect(wrapper.instance().presenter).toBeDefined();
    expect(spy).toBeCalled();
    spy.mockRestore();
  });
});
