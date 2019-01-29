import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Button,
  TouchableHighlight,
  CheckBox,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { FloatingActionButton } from '../utils/custom-views-helper';
import AbstractRequestScreen from './AbstractRequestScreen';
import DataManager from '../controllers/DataManager';
import defaultStyles from '../utils/styles';
import EditProductInListModal from './EditProductInListModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default class OrderScreen extends AbstractRequestScreen {
    static navigationOptions = ({ navigation }) => ({
      title: 'Comprando',
      headerRight: (
        <Button
          title="+"
          onPress={() => navigation.navigate('SearchProduct')}
        />
      ),
    });

    requestData = () => DataManager.getShopListById(this.props.navigation.state.params.id)

    onDataRequested(data, error) {
      const { refresh } = this.state;
      if (data) {
        this.setState({
          name: data.name, data: data.products, isLoading: false, refresh: !refresh,
        });
      } else {
        super.onDataRequested(data, error);
      }
    }

    newProduct = () => {
      const { navigate } = this.props.navigation;
      navigate('SearchProduct', {
        backTo: 'NewListScreen',
        onBack: this.addProductToTheList,
      });
    }

    addProductToTheList = (product) => {
      const { products, refresh } = this.state;
      products.push(product);
      this.setState({ products, refresh: !refresh });
    }

    selectProduct = (product) => {
      this.setState({ selectedProduct: product, modalVisible: true });
    }

    removeProductFromOrderListWithConfirmation = (item) => {
      Alert.alert(
        'Atenção!',
        'Tem certeza que quer excluir esse produto da lista? (isso não excluirá o produto do sistema)',
        [
          {
            text: 'Excluir',
            onPress: () => {
              this.deleteProductFromOrder(item);
            },
          },
          {
            text: 'Cancelar',
          },
        ],
      );
    }

    deleteProductFromOrder = (item) => {
      const { data, refresh } = this.state;
      this.setState({ isLoading: true }, () => DataManager.removeProductFromOrder(item.id).then(() => {
        const list = data;
        return list.filter(value => value.id !== item.id);
      }).then((newList) => {
        this.setState({ isLoading: false, data: newList, refresh: !refresh });
      }));
    }

    editProduct = (item) => {
      this.props.navigation.navigate('NewProduct', {
        name: item.name,
        id: item.id,
        onBack: () => {
          this.request();
        },
      });
    }

    renderItem = ({ item }) => (
      <TouchableHighlight onPress={() => this.selectProduct(item)}>
        <View>
          <CheckBox
            title=""
            checked={item.checked}
            onValueChange={() => {}}
          />
          <Text>
            {item.name}
            {' '}
-
            {' '}
          </Text>
          <Text>{item.value}</Text>
          <Menu>
            <MenuTrigger>
              <Text>...</Text>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => this.editProduct(item)} text="Editar Produto" />
              <MenuOption onSelect={() => this.removeProductFromOrderListWithConfirmation(item)}>
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
          <View style={[ styles.container, styles.horizontal ]}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }
      return (
        <View style={defaultStyles.fullHeght}>
          { this.state.selectedProduct
            ? (
              <EditProductInListModal
                product={this.state.selectedProduct}
                visible={this.state.modalVisible}
                onRequestClose={product => this.updateProduct(product)}
              />
            )
            : null }
          <Text>{this.state.name}</Text>
          {
            this.state.id
              ? (
                <Text>
ID:
                  {this.state.id}
                </Text>
              )
              : null
          }
          <FlatList
            data={this.state.data}
            extraData={this.state.refresh}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            style={defaultStyles.fullHeght}
          />
          <FloatingActionButton onPress={this.newProduct} />
        </View>
      );
    }
}

// <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
