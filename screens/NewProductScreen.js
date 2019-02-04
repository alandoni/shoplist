import React from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Picker,
} from 'react-native';
import DataManager from '../controllers/DataManager';
import AbstractRequestScreen from './AbstractRequestScreen';
import { defaultStyles } from '../utils/styles';
import { NavigationButton, ProgressView, ErrorView } from '../utils/custom-views-helper';

export default class NewProductScreen extends AbstractRequestScreen {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Novo Produto',
      headerRight: (
        <NavigationButton onPress={() => params.saveProduct()} title="Salvar" />
      ),
    };
  };

  componentDidMount() {
    super.componentDidMount();
    this.props.navigation.setParams({ saveProduct: this.saveProduct });
    this.setState({ id: this.props.navigation.getParam('id', null) });
  }

  requestData = () => {
    const data = {};
    return DataManager.getAllCategories().then((categories) => {
      data.categories = categories;
      return this.requestProductIfNeeded();
    }).then((product) => {
      if (product) {
        data.product = product;
      }
      return data;
    });
  }

  requestProductIfNeeded = () => {
    if (this.state.id) {
      return DataManager.getProductById(this.state.id);
    }
    return Promise.resolve(null);
  }

  onDataRequested(data, error) {
    const newData = data;
    if (newData) {
      const category = data.categories[0];
      if (newData.product) {
        newData.name = data.product.name;
        newData.value = data.product.value;
        newData.category.id = data.product.category;
        newData.notes = data.product.notes;
      }
      const { refresh } = this.state;
      this.setState({
        data: newData,
        category,
        error,
        isLoading: false,
        refresh: !refresh,
      });
    } else {
      super.onDataRequested(newData, error);
    }
  }

  saveProduct = () => {
    this.setState({ isLoading: true }, () => this.saveOrUpdate().then((product) => {
      this.props.navigation.state.params.onBack(product);
      this.props.navigation.goBack();
    }).catch((error) => {
      this.setState({ error, isLoading: false });
    }));
  }

  saveOrUpdate() {
    if (this.state.id) {
      return DataManager.updateProduct(
        this.props.id,
        this.state.name,
        this.state.value,
        this.state.notes,
        this.state.category.id,
      );
    }
    return DataManager.saveProduct(
      this.state.name,
      this.state.value,
      this.state.notes,
      this.state.category.id,
    );
  }

  newCategory = () => {
    this.props.navigation.navigate('NewCategory', { onBack: category => this.addCategory(category) });
  }

  addCategory = (category) => {
    const { categories } = this.state.data;
    categories.push(category);

    const { data } = this.state;
    data.categories = categories;
    this.setState({ data, category });
  }

  renderCategory = category => (
    <Picker.Item
      label={category.name}
      value={category}
      key={category.id}
      style={[ defaultStyles.textInput ]}
    />
  );

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
          placeholder="Nome"
          onChangeText={(text) => { this.setState({ name: text }); }}
          value={this.state.name}
          style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
        />
        {this.state.id
          ? (
            <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
              ID:
              {' '}
              {this.state.id}
            </Text>
          )
          : null}
        <TextInput
          placeholder="Valor"
          onChangeText={(text) => { this.setState({ value: text }); }}
          value={this.state.value}
          style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
        />

        <View>
          <View style={defaultStyles.fullWidth}>
            <Picker
              style={defaultStyles.fill}
              selectedValue={this.state.category}
              onValueChange={category => this.setState({ category })}
            >
              {this.state.data.categories.map(this.renderCategory)}
            </Picker>
            <TouchableOpacity onPress={this.newCategory}>
              <Text>Nova Categoria</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          placeholder="Observação"
          onChangeText={(text) => { this.setState({ notes: text }); }}
          value={this.state.notes}
          style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
        />
      </View>
    );
  }
}
