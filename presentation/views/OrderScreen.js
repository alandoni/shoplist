import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableHighlight,
  CheckBox,
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
  MenuButton,
  ProgressView,
  ErrorView,
  NavigationButton,
} from '../utils/custom-views-helper';
import { defaultStyles } from '../utils/styles';
import EditProductInListModal from './EditProductInListModal';
import OrderPresenter from '../presenters/OrderPresenter';

export default class OrderScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Comprando',
    headerRight: (
      <NavigationButton onPress={() => navigation.navigate('SearchProduct')} title="+" />
    ),
  });

  componentDidMount() {
    this.props.navigation.setParams({ saveShopList: this.saveOrder });

    const name = this.props.navigation.getParam('name', '');
    const id = this.props.navigation.getParam('id', null);
    const shopListId = this.props.navigation.getParam('shopListId', null);

    this.presenter = new OrderPresenter(this, id, shopListId, name);
  }

  requestData = () => this.presenter.getOrder();

  saveOrder = async (close) => {
    const order = await this.presenter.saveOrder();
    if (close) {
      this.props.navigation.state.params.onBack(order);
      this.props.navigation.goBack();
    }
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
    this.presenter.addProductToTheList(product);
  }

  editAmountAndPrice = (item) => {
    this.setState({ modalVisible: true, selectedProduct: item });
  }

  updateProduct = (product) => {
    const { selectProduct } = this.state;
    this.presenter.updateProductInTheList(selectProduct, product.amount, product.value);
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
    this.presenter.deleteProductFromList(item.id);
  }

  update(newState) {
    this.setState(newState);
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => this.selectProduct(item)}>
      <View style={defaultStyles.listItem}>
        <CheckBox
          title=""
          checked={item.checked}
          onValueChange={() => { }}
        />
        <View style={[ defaultStyles.fill ]}>
          <Text style={[ defaultStyles.listItemTitle ]}>
            {item.name}
          </Text>
          <Text style={[ defaultStyles.listItemSubtitle ]}>
            {item.amount} unidade(s) de {item.value}
          </Text>
        </View>
        <Text style={[ defaultStyles.listItemTitle, defaultStyles.currency, defaultStyles.horizontalMargins ]}>
          {item.totalValue}
        </Text>
        <Menu>
          <MenuTrigger>
            <MenuButton />
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
      return <ProgressView />;
    }
    if (this.state.error) {
      return <ErrorView error={this.state.error} />;
    }
    return (
      <View style={defaultStyles.fullHeight}>
        {this.state.selectedProduct
          ? (
            <EditProductInListModal
              product={this.state.selectedProduct}
              visible={this.state.modalVisible}
              onRequestClose={product => this.updateProduct(product)}
            />
          )
          : null}
        <Text style={[ defaultStyles.listItemTitle, defaultStyles.verticalMargin, defaultStyles.horizontalMargin ]}>
          {this.state.order.shopList.name}
        </Text>
        {this.state.order.id
          ? (
            <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
              ID:
              {' '}
              {this.state.order.id}
            </Text>
          )
          : null}
        <View style={defaultStyles.fullHeight}>
          <FlatList
            data={this.state.order.products}
            extraData={this.state.refresh}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            style={defaultStyles.fullHeight}
          />
          <FloatingActionButton onPress={this.newProduct} />
        </View>
        <View style={defaultStyles.footer}>
          <View style={defaultStyles.fullWidth}>
            <View style={[ defaultStyles.fill ]}>
              <Text style={defaultStyles.center}>Total de Produtos</Text>
              <Text style={[ defaultStyles.listItemTitle, defaultStyles.center ]}>
                {this.state.order.amountProducts}
              </Text>
            </View>
            <View style={[ defaultStyles.fill ]}>
              <Text style={defaultStyles.center}>Valor Total</Text>
              <Text style={[ defaultStyles.listItemTitle, defaultStyles.center ]}>{this.state.order.totalValue}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
