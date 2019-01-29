import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableHighlight,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { FloatingActionButton } from '../utils/custom-views-helper';
import DataManager from '../controllers/DataManager';
import AbstractRequestScreen from './AbstractRequestScreen';
import defaultStyles from '../utils/styles';

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default class HomeScreen extends AbstractRequestScreen {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Listas de Compras',
      headerRight: (
        <Button
          title="+"
          onPress={() => params.createNewShopList()}
        />
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ createNewShopList: this.createNewShopList });
    super.componentDidMount();
  }

  requestData = () => DataManager.getAllShopLists()

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
    this.setState({ isLoading: true }, () => DataManager.removeShopList(item.id).then(() => {
      const { data, refresh } = this.state.data;
      const list = data.filter(value => value.id !== item.id);
      this.setState({ isLoading: false, data: list, refresh: !refresh });
    }));
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => this.startOrder(item)}>
      <View>
        <Text>
          {item.name}
          {' '}
          -
          {' '}
        </Text>
        <Text>{item.totalValue}</Text>
        <Menu>
          <MenuTrigger>
            <Text>...</Text>
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
      return (
        <View style={[ defaultStyles.fullHeght, styles.horizontal ]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    if (this.state.error) {
      return (
        <View style={[ defaultStyles.fullHeght, styles.horizontal ]}>
          <Text>this.state.error</Text>
        </View>
      );
    }
    return (
      <View style={defaultStyles.fullHeght}>
        <FlatList
          data={this.state.data}
          extraData={this.state.refresh}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          style={defaultStyles.fullHeght}
        />
        <FloatingActionButton onPress={this.createNewShopList} />
      </View>
    );
  }
}
