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
import AbstractRequestScreen from './AbstractRequestScreen';
import { defaultStyles } from '../utils/styles';
import EditProductInListModal from './EditProductInListModal';
import OrderPresenter from '../controllers/OrderPresenter';

export default class OrderScreen extends AbstractRequestScreen {
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

    this.presenter = new OrderPresenter(id, shopListId, name);

    this.setState(this.presenter.order, () => {
      super.componentDidMount();
    });
  }

  requestData = () => this.presenter.getOrder();

  onDataRequested(data, error) {
    const { refresh } = this.state;
    if (data) {
      this.setState({
        ...data,
        error,
        isLoading: false,
        refresh: !refresh,
      });
    } else {
      super.onDataRequested(data, error);
    }
  }

  saveOrder = (close) => {
    this.setState({ isLoading: true }, () => {
      this.presenter.saveOrder().then((order) => {
        if (close) {
          this.props.navigation.state.params.onBack(order);
          this.props.navigation.goBack();
        } else {
          this.setState({ ...order, isLoading: false });
        }
      }).catch((error) => {
        this.setState({ error, isLoading: false });
      });
    });
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
    this.setState({ isLoading: true }, () => {
      this.presenter.addProductToTheList(product).then((order) => {
        const { refresh } = this.state;
        this.setState({ ...order, refresh: !refresh, isLoading: false });
      });
    });
  }

  editAmountAndPrice = (item) => {
    this.setState({ modalVisible: true, selectedProduct: item });
  }

  updateProduct = (product) => {
    const { selectProduct } = this.state;
    this.setState({ isLoading: true }, () => {
      this.presenter.updateProductInTheList(selectProduct, product.amount, product.value).then((order) => {
        const { refresh } = this.state;
        this.setState({ ...order, refresh: !refresh, isLoading: false });
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
    this.setState({ isLoading: true }, () => this.presenter.deleteProductFromList(item.id).then((order) => {
      const { refresh } = this.state;
      this.setState({ ...order, refresh: !refresh, isLoading: false });
    }));
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
          {this.state.name}
        </Text>
        {this.state.id
          ? (
            <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
              ID:
              {' '}
              {this.state.id}
            </Text>
          )
          : null}
        <View style={defaultStyles.fullHeight}>
          <FlatList
            data={this.state.data}
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
              <Text style={[ defaultStyles.listItemTitle, defaultStyles.center ]}>{this.state.amount}</Text>
            </View>
            <View style={[ defaultStyles.fill ]}>
              <Text style={defaultStyles.center}>Valor Total</Text>
              <Text style={[ defaultStyles.listItemTitle, defaultStyles.center ]}>{this.state.totalValue}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
