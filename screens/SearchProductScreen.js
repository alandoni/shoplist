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
import AbstractRequestScreen from './AbstractRequestScreen';
import DataManager from '../controllers/DataManager';

export default class SearchProductScreen extends AbstractRequestScreen {
  static navigationOptions = ({ navigation }) => ({
    title: 'Procurar Produto',
    headerRight: (
      <NavigationButton onPress={() => navigation.navigate('NewProduct')} title="+" />
    ),
  });

  requestData = () => {
    if (!this.state.text || this.state.text.length === 0) {
      return DataManager.getAllProducts();
    }
    return DataManager.searchProductByName(this.state.text);
  }

  createNewProduct = () => {
    this.props.navigation.navigate('NewProduct', {
      backTo: this.props.navigation.getParam('backTo', 'SearchProduct'),
      onBack: () => {
        this.request();
      },
    });
  }

  searchProduct = (text) => {
    this.setState({ text }, () => {
      this.request();
    });
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
    const { data, refresh } = this.state;
    this.setState({ isLoading: true }, () => DataManager.removeProduct(item.id).then(() => {
      const list = data;
      return list.filter(value => value.id !== item.id);
    }).then((newList) => {
      this.setState({ isLoading: false, data: newList, refresh: !refresh });
    }));
  }

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.selectItem(item)} style={defaultStyles.listItem}>
      <Text style={[ defaultStyles.listItemTitle, defaultStyles.fill ]}>
        {item.name}
      </Text>
      <Text style={[ defaultStyles.listItemTitle, defaultStyles.currency, defaultStyles.horizontalMargins ]}>
        {item.value}
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
          data={this.state.data}
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
