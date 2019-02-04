import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  FlatList,
  Alert,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {
  FloatingActionButton,
  ErrorView,
  ProgressView,
  MenuButton,
  NavigationButton,
} from '../utils/custom-views-helper';
import AbstractRequestScreen from './AbstractRequestScreen';
import { defaultStyles } from '../utils/styles';
import HomeScreenPresenter from '../controllers/HomeScreenPresenter';
import { formatCurrency } from '../utils/utils';

export default class HomeScreen extends AbstractRequestScreen {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Listas de Compras',
      headerRight: (
        <NavigationButton onPress={() => params.createNewShopList()} title="+" />
      ),
    };
  };

  componentDidMount() {
    this.presenter = new HomeScreenPresenter();
    this.props.navigation.setParams({ createNewShopList: this.createNewShopList });
    super.componentDidMount();
  }

  requestData = () => this.presenter.getAllShopLists();

  createNewShopList = () => {
    this.props.navigation.navigate('NewList', { onBack: () => this.request() });
  }

  startOrder = (item) => {
    const { navigate } = this.props.navigation;
    navigate('Order', { name: item.name, id: item.id });
  }

  editList = (item) => {
    const { navigate } = this.props.navigation;
    navigate('NewList', { name: item.name, id: item.id, onBack: () => this.request() });
  }

  removeShopListWithConfirmation = (item) => {
    Alert.alert(
      'Atenção!',
      'Tem certeza que quer excluir essa lista de compras?',
      [
        {
          text: 'Excluir',
          onPress: () => {
            this.deleteShopList(item);
          },
        },
        {
          text: 'Cancelar',
        },
      ],
    );
  }

  deleteShopList = (item) => {
    this.setState({ isLoading: true }, () => this.presenter.deleteShopList(item).then((newList) => {
      const { refresh } = this.state.refresh;
      this.setState({ isLoading: false, data: newList, refresh: !refresh });
    }));
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => this.startOrder(item)}>
      <View style={defaultStyles.listItem}>
        <Text style={[ defaultStyles.fill, defaultStyles.listItemTitle ]}>
          {item.name}
        </Text>
        <Text style={[ defaultStyles.currency, defaultStyles.horizontalMargins, defaultStyles.listItemTitle ]}>
          {formatCurrency(item.totalValue)}
        </Text>
        <Menu>
          <MenuTrigger>
            <MenuButton />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => this.editList(item)} text="Editar" />
            <MenuOption onSelect={() => this.removeShopListWithConfirmation(item)}>
              <Text style={{ color: 'red' }}>Excluir</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    </TouchableHighlight>
  )

  render() {
    if (this.state.isLoading) {
      return <ProgressView />;
    }
    if (this.state.error) {
      return <ErrorView error={this.state.error} />;
    }
    return (
      <View style={defaultStyles.fullHeight}>
        <FlatList
          data={this.state.data}
          extraData={this.state.refresh}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          style={defaultStyles.fullHeight}
        />
        <FloatingActionButton onPress={this.createNewShopList} />
      </View>
    );
  }
}
