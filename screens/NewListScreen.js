import React from 'react';
import {
  TouchableHighlight,
  View,
  Text,
  TextInput,
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
  FloatingActionButton, MenuButton, NavigationButton, ProgressView, ErrorView,
} from '../utils/custom-views-helper';
import EditProductInListModal from './EditProductInListModal';
import AbstractRequestScreen from './AbstractRequestScreen';
import { defaultStyles } from '../utils/styles';
import NewListPresenter from '../controllers/NewListPresenter';
import { formatCurrency } from '../utils/utils';

export default class NewListScreen extends AbstractRequestScreen {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Editar Lista de Compras',
      headerRight: (
        <NavigationButton onPress={() => params.saveShopList()} title="Salvar" />
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ saveShopList: this.saveShopList });

    const name = this.props.navigation.getParam('name', '');
    const id = this.props.navigation.getParam('id', null);

    this.presenter = new NewListPresenter(name, id);

    this.setState({
      name,
      id,
      products: [],
    }, () => {
      super.componentDidMount();
    });
  }

  requestData = () => this.presenter.requestShopList();

  onDataRequested(data, error) {
    if (data) {
      const { refresh } = this.state;
      this.setState({ ...!refresh, isLoading: false, data });
    } else {
      super.onDataRequested(data, error);
    }
  }

  saveShopList = (close) => {
    this.setState({ isLoading: true }, () => {
      this.presenter.saveShopList().then((shopList) => {
        if (close) {
          this.props.navigation.state.params.onBack(shopList);
          this.props.navigation.goBack();
        } else {
          const { refresh } = this.state;
          this.setState({ ...!refresh, isLoading: false, shopList });
        }
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
      this.presenter.addProductToTheList(product).then((shopList) => {
        const { refresh } = this.state;
        this.setState({ ...shopList, refresh: !refresh, isLoading: false });
      });
    });
  }

  editAmountAndPrice = (item) => {
    this.setState({ modalVisible: true, selectedProduct: item });
  }

  updateProduct = (product) => {
    const { selectProduct } = this.state;
    this.setState({ isLoading: true }, () => {
      this.presenter.updateProductInTheList(selectProduct, product.amount, product.value).then((shopList) => {
        const { refresh } = this.state;
        this.setState({ ...shopList, refresh: !refresh, isLoading: false });
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
    this.setState({ isLoading: true }, () => this.presenter.deleteProductFromList(item.id).then((shopList) => {
      const { refresh } = this.state;
      this.setState({ ...!refresh, isLoading: false, shopList });
    }));
  }

  setName = (name) => {
    this.setState({ name });
    this.presenter.setName(name);
  }

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => { this.selectProduct(item); }}>
      <View style={defaultStyles.listItem}>
        <View style={[ defaultStyles.fill ]}>
          <Text style={[ defaultStyles.listItemTitle ]}>
            {item.name}
          </Text>
          <Text style={[ defaultStyles.listItemSubtitle ]}>
            {item.amount} unidade(s) de {formatCurrency(item.value)}
          </Text>
        </View>
        <Text style={[ defaultStyles.listItemTitle, defaultStyles.currency, defaultStyles.horizontalMargins ]}>
          {formatCurrency(item.totalValue)}
        </Text>
        <Menu>
          <MenuTrigger>
            <MenuButton />
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
        <TextInput
          placeholder="Descrição"
          onChangeText={this.setName}
          value={this.state.name}
          style={[ defaultStyles.textInput, defaultStyles.verticalMargin ]}
        />
        { this.state.validationError
          ? <Text>{this.state.validationError}</Text>
          : null }
        {this.state.id
          ? (
            <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
              ID: {this.state.id}
            </Text>
          )
          : null}
        <View style={defaultStyles.fullHeight}>
          <FlatList
            data={this.state.products}
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
              <Text style={[ defaultStyles.listItemTitle, defaultStyles.center ]}>
                {formatCurrency(this.state.totalValue)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
