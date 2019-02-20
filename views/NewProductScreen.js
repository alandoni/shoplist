import React from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Picker,
} from 'react-native';
import AbstractRequestScreen from './AbstractRequestScreen';
import { defaultStyles } from '../utils/styles';
import { NavigationButton, ProgressView, ErrorView } from '../utils/custom-views-helper';
import NewProductPresenter from '../controllers/NewProductPresenter';
import { formatCurrency, parseCurrency } from '../utils/utils';

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
    this.props.navigation.setParams({ saveProduct: this.saveProduct });
    const id = this.props.navigation.getParam('id', null);
    this.setState({ id });
    this.presenter = new NewProductPresenter(id);
    super.componentDidMount();
  }

  requestData = () => this.presenter.getCategoriesAndProductIfNeeded();

  onDataRequested(data, error) {
    const { refresh } = this.state;
    if (data) {
      this.setState({ ...data, isLoading: false, refresh: !refresh });
    } else {
      super.onDataRequested(data, error);
    }
  }

  saveProduct = () => {
    this.setState({ isLoading: true }, () => this.presenter.saveProduct().then((product) => {
      this.props.navigation.state.params.onBack(product);
      this.props.navigation.goBack();
    }).catch((error) => {
      this.setState({ error, isLoading: false });
    }));
  }

  newCategory = () => {
    this.props.navigation.navigate('NewCategory', { onBack: category => this.addCategory(category) });
  }

  addCategory = (category) => {
    this.presenter.addCategory(category);
    this.setState({ categories: this.presenter.categories, category: this.presenter.category });
  }

  renderCategory = category => (
    <Picker.Item
      label={category.name}
      value={category}
      key={category.id}
      style={[ defaultStyles.textInput ]}
    />
  );

  setName = (name) => {
    this.presenter.setName(name);
    this.setState({ name });
  }

  setValue = (value) => {
    const parsedValue = parseCurrency(value);
    this.presenter.setValue(parsedValue);
    this.setState({ parsedValue });
  }

  setCategory = (category) => {
    this.presenter.setCategory(category);
    this.setState({ category });
  }

  setNotes = (notes) => {
    this.presenter.setNotes(notes);
    this.setState({ notes });
  }

  render() {
    if (this.state.isLoading) {
      return <ProgressView />;
    }
    if (this.state.error) {
      return <ErrorView error={this.state.error} />;
    }
    return (
      <View style={defaultStyles.fullHeight}>
        <View>
          <TextInput
            placeholder="Nome"
            onChangeText={this.setName}
            value={this.state.name}
            style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
          />
          {this.state.id
            ? (
              <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
                ID: {this.state.id}
              </Text>
            )
            : null}
          <TextInput
            placeholder="Valor"
            onChangeText={this.setValue}
            value={formatCurrency(this.state.value)}
            style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
          />
        </View>

        <View style={[ defaultStyles.column, defaultStyles.marginTop ]}>
          <Picker
            style={[ defaultStyles.fill, defaultStyles.test ]}
            selectedValue={this.state.category}
            onValueChange={this.setCategory}
          >
            {this.state.categories.map(this.renderCategory)}
          </Picker>
          <TouchableOpacity
            onPress={this.newCategory}
          >
            <Text style={defaultStyles.button}>Nova Categoria</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TextInput
            placeholder="Observação"
            onChangeText={this.setNotes}
            value={this.state.notes}
            style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
          />
        </View>
      </View>
    );
  }
}
