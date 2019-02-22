import React from 'react';
import {
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  FloatingActionButton, NavigationButton, ProgressView, ErrorView,
} from '../utils/custom-views-helper';
import { defaultStyles } from '../utils/styles';
import SearchProductPresenter from '../presenters/SearchProductPresenter';
import { formatCurrency } from '../utils/utils';

export default class SearchProductScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Procurar Produto',
    headerRight: (
      <NavigationButton onPress={() => navigation.navigate('NewProduct')} title="+" />
    ),
  });

  componentDidMount() {
    this.presenter = new SearchProductPresenter(this);
    this.requestData();
  }

  requestData = () => this.presenter.getProducts();

  createNewProduct = () => {
    this.props.navigation.navigate('NewProduct', {
      backTo: this.props.navigation.getParam('backTo', 'SearchProduct'),
      onBack: () => {
        this.request();
      },
    });
  }

  searchProduct = (text) => {
    this.presenter.search(text);
    this.requestData();
  }

  selectItem = (item) => {
    const { navigation } = this.props;
    navigation.state.params.onBack(item);
    navigation.goBack();
  }

  removeProductWithConfirmation = (item) => {
    Alert.alert(
      'Atenção!',
      'Tem certeza que quer excluir esse produto? (Isso afetará as listas de produtos)',
      [
        {
          text: 'Excluir',
          onPress: () => {
            this.deleteProduct(item);
          },
        },
        {
          text: 'Cancelar',
        },
      ],
    );
  }

  deleteProduct = (item) => {
    this.presenter.deleteProduct(item);
  }

  update(newState) {
    this.setState(newState);
  }

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.selectItem(item)} style={defaultStyles.listItem}>
      <Text style={[ defaultStyles.listItemTitle, defaultStyles.fill ]}>
        {item.name}
      </Text>
      <Text style={[ defaultStyles.listItemTitle, defaultStyles.currency, defaultStyles.horizontalMargins ]}>
        {formatCurrency(item.value)}
      </Text>
    </TouchableOpacity>
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
        <TextInput
          placeholder="Procurar produto"
          onChangeText={this.searchProduct}
          value={this.state.text}
          style={[ defaultStyles.textInput, defaultStyles.verticalMargin ]}
        />
        <FlatList
          data={this.state.products}
          extraData={this.state.refresh}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          style={defaultStyles.fullHeight}
        />
        <FloatingActionButton onPress={this.createNewProduct} />
      </View>
    );
  }
}
