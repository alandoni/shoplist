import React from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Picker,
} from 'react-native';
import { defaultStyles } from '../utils/styles';
import { NavigationButton, ProgressView, ErrorView } from '../utils/custom-views-helper';
import NewProductPresenter from '../presenters/NewProductPresenter';
import { formatCurrency, parseCurrency } from '../utils/utils';

export default class NewProductScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Novo Produto',
      headerRight: (
        <NavigationButton onPress={() => params.saveProduct()} title="Salvar" />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ saveProduct: this.saveProduct });
    const id = this.props.navigation.getParam('id', null);
    this.presenter = new NewProductPresenter(this, id);
    this.requestData();
  }

  requestData = () => this.presenter.getCategoriesAndProductIfNeeded();

  saveProduct = async () => {
    const product = await this.presenter.saveProduct();
    this.props.navigation.state.params.onBack(product);
    this.props.navigation.goBack();
  }

  newCategory = () => {
    this.props.navigation.navigate('NewCategory', { onBack: category => this.addCategory(category) });
  }

  addCategory = (category) => {
    this.presenter.addCategory(category);
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
  }

  setValue = (value) => {
    const parsedValue = parseCurrency(value);
    this.presenter.setValue(parsedValue);
  }

  setCategory = (category) => {
    this.presenter.setCategory(category);
  }

  setNotes = (notes) => {
    this.presenter.setNotes(notes);
  }

  update(newState) {
    this.setState(newState);
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
            value={this.state.product.name}
            style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
          />
          {this.state.product.id
            ? (
              <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
                ID: {this.state.product.id}
              </Text>
            )
            : null}
          <TextInput
            placeholder="Valor"
            onChangeText={this.setValue}
            value={formatCurrency(this.state.product.value)}
            style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
          />
        </View>

        <View style={[ defaultStyles.column, defaultStyles.marginTop ]}>
          {this.state.categories
            ? (
              <Picker
                style={[ defaultStyles.fill, defaultStyles.test ]}
                selectedValue={this.state.product.category}
                onValueChange={this.setCategory}
              >
                {this.state.categories.map(this.renderCategory)}
              </Picker>
            )
            : null}
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
            value={this.state.product.notes}
            style={[ defaultStyles.textInput, defaultStyles.marginTop ]}
          />
        </View>
      </View>
    );
  }
}
