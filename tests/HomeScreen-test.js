import React from 'react';
import {
  FlatList,
  Alert,
} from 'react-native';
import {
  FloatingActionButton,
} from '../presentation/utils/custom-views-helper';
import { shallow } from 'enzyme';
import HomeScreen from '../presentation/views/HomeScreen';

const navigation = {
  navigate: jest.fn(),
  params: [],
  setParams: function (params) {
    this.params = params;
  },
};

describe('Test HomeScreen', () => {
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

  it('Has FlatList if not loading', () => {
    wrapper.instance().update({isLoading: false});
    wrapper.update();
    expect(wrapper.find(FlatList)).toHaveLength(1);
    expect(wrapper.find(FloatingActionButton)).toHaveLength(1);
  });

  it('No FlatList if loading', () => {
    wrapper.instance().update({isLoading: true});
    wrapper.update();
    expect(wrapper.find(FlatList)).toHaveLength(0);
    expect(wrapper.find(FloatingActionButton)).toHaveLength(0);
  });

  it('Get All shop lists when requesting data calling presenter', () => {
    const spy = jest.spyOn(wrapper.instance().presenter, 'getAllShopLists');
    wrapper.instance().requestData();
    expect(spy).toBeCalled();
    spy.mockRestore();
  });

  it('Goes to NewList on clicking on floating button', () => {
    const spy = jest.spyOn(navigation, 'navigate');
    wrapper.instance().createNewShopList();
    expect(spy).toBeCalledWith('NewList', { onBack: expect.any(Function) } );
    spy.mockRestore();
  });

  it('Goes to Order on clicking on an item', () => {
    const spy = jest.spyOn(navigation, 'navigate');
    const item = { name: 'item', id: 3 };
    wrapper.instance().startOrder(item);
    expect(spy).toBeCalledWith('Order', { name: item.name, shopListId: item.id } );
    spy.mockRestore();
  });

  it('Goes to NewList on clicking on Edit on menu', () => {
    const spy = jest.spyOn(navigation, 'navigate');
    const item = { name: 'item', id: 3 };
    wrapper.instance().editList(item);
    expect(spy).toBeCalledWith('NewList', {
      name: item.name, 
      id: item.id,
      onBack: expect.any(Function) 
    });
    spy.mockRestore();
  });

  it('Remove item on clicking on Delete on menu', () => {
    const spy = jest.spyOn(Alert, 'alert');
    const item = { name: 'item', id: 3 };
    wrapper.instance().removeShopListWithConfirmation(item);
    expect(spy).toBeCalledWith(
      'Atenção!',
      'Tem certeza que quer excluir essa lista de compras?',
      [
        { text: 'Excluir', onPress: expect.any(Function) },
        { text: 'Cancelar' },
      ],
    );
    spy.mockRestore();
  });

  it('Delete item calling the presenter', () => {
    const spy = jest.spyOn(wrapper.instance().presenter, 'deleteShopList');
    wrapper.instance().deleteShopList();
    expect(spy).toBeCalled();
    spy.mockRestore();
  });

  it('Update state calling update', () => {
    const spy = jest.spyOn(wrapper.instance(), 'setState');
    const state = { isLoading: false };
    wrapper.instance().update(state);
    expect(spy).toBeCalledWith(state);
    spy.mockRestore();
  });
});
