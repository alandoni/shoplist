import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
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
import EditProductInListModal from './EditProductInListModal';
import DataManager from '../controllers/DataManager';
import AbstractRequestScreen from './AbstractRequestScreen';
import defaultStyles from '../utils/styles';
import '../utils/utils';

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

export default class NewListScreen extends AbstractRequestScreen {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Editar Lista de Compras',
      headerRight: (
        <Button
          title="Salvar"
          onPress={() => params.saveShopList(true)}
        />
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ saveShopList: this.saveShopList });

    const name = this.props.navigation.getParam('name', '');
    const id = this.props.navigation.getParam('id', null);

    this.setState({
      name,
      id,
      products: [],
    }, () => {
      super.componentDidMount();
    });
  }

  requestData = () => {
    if (this.state.id) {
      return DataManager.getShopListById(this.state.id);
    }
    return Promise.resolve(null);
  }

  onDataRequested(data, error) {
    const { refresh } = this.state;
    if (data) {
      this.setState({
        name: data.name, products: data.products, error, isLoading: false, refresh: !refresh,
      });
    } else {
      super.onDataRequested(data, error);
    }
  }

  saveShopList = (close) => {
    if (this.state.name.length < 2) {
      this.setState({ error: 'Por favor, digite um nome válido!' });
      return;
    }

    this.setState({ isLoading: true }, () => {
      this.saveOrUpdate().then((shopList) => {
        if (close) {
          this.props.navigation.state.params.onBack(shopList);
          this.props.navigation.goBack();
        } else {
          this.setState({ id: shopList.id, isLoading: false });
        }
      }).catch((error) => {
        this.setState({ error, isLoading: false });
      });
    });
  }

  saveOrUpdate = () => {
    if (this.state.id) {
      return DataManager.updateShopList(this.state.id, this.state.name, this.state.products);
    }
    return DataManager.saveShopList(this.state.name, this.state.products);
  }

  selectProduct = (product) => {
    this.setState({ selectedProduct: product, modalVisible: true });
  }

  newProduct = () => {
    const { navigate } = this.props.navigation;
    navigate('SearchProduct', {
      backTo: 'NewListScreen',
      onBack: this.addProductToTheList,
    });
  }

  addProductToTheList = (product) => {
    const newProduct = product;
    const { products, refresh } = this.state;
    newProduct.amount = 1;
    newProduct.totalValue = product.amount * product.value;
    products.push(newProduct);
    this.setState({ products, refresh: !refresh }, () => {
      this.saveShopList(false);
    });
  }

  editAmountAndPrice = (item) => {
    this.setState({ modalVisible: true, selectedProduct: item });
  }

  updateProduct = (product) => {
    const { selectProduct } = this.state;
    this.setState({ isLoading: true }, () => {
      DataManager.updateProductInShopList(selectProduct.id, product.amount, product.value).then((storedProduct) => {
        const { products, refresh } = this.state;
        const newProduct = storedProduct;
        newProduct.totalValue = storedProduct.amount * storedProduct.value;

        products.setElement(newProduct, value => value.id === newProduct.id);

        this.setState({
          isLoading: false, products, refresh: !refresh, modalVisible: false,
        });
      });
    });
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

  removeProductFromShopListWithConfirmation = (item) => {
    Alert.alert(
      'Atenção!',
      'Tem certeza que quer excluir esse produto da lista? (isso não excluirá o produto do sistema)',
      [
        {
          text: 'Excluir',
          onPress: () => {
            this.deleteProductFromShopList(item);
          },
        },
        {
          text: 'Cancelar',
        },
      ],
    );
  }

  deleteProductFromShopList = (item) => {
    this.setState({ isLoading: true }, () => DataManager.removeProductFromShopList(item.id).then(() => {
      const { products, refresh } = this.state;
      const newList = products.filter(value => value.id !== item.id);
      this.setState({ isLoading: false, products: newList, refresh: !refresh });
    }));
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => { this.selectProduct(item); }}>
      <View>
        <Text>
          {item.name}
          {' '}
          -
          {' '}
        </Text>
        <Text>
          {item.value}
          {' '}
          -
          {' '}
        </Text>
        <Text>
          {item.amount}
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
            <MenuOption onSelect={() => this.editProduct(item)} text="Editar Produto" />
            <MenuOption onSelect={() => this.removeProductFromShopListWithConfirmation(item)}>
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
        {this.state.selectedProduct
          ? (
            <EditProductInListModal
              product={this.state.selectedProduct}
              visible={this.state.modalVisible}
              onRequestClose={product => this.updateProduct(product)}
            />
          )
          : null}
        <TextInput
          placeholder="Descrição"
          onChangeText={(text) => { this.setState({ name: text }); }}
          value={this.state.name}
        />
        {this.state.error
          ? <Text>{this.state.error}</Text>
          : null}
        {this.props.id
          ? (
            <Text>
              ID:
              {this.props.id}
            </Text>
          )
          : null}
        <FlatList
          data={this.state.products}
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
