import React from 'react';
import {
  TextInput,
  Text,
  View,
} from 'react-native';
import { defaultStyles } from '../utils/styles';
import { NavigationButton, ProgressView, ErrorView } from '../utils/custom-views-helper';
import NewCategoryPresenter from '../presenters/NewCategoryPresenter';

export default class NewCategoryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Nova Categoria',
      headerRight: (
        <NavigationButton onPress={() => params.saveCategory()} title="Salvar" />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ saveCategory: this.saveCategory });
    const id = this.props.navigation.getParam('id', null);
    this.presenter = new NewCategoryPresenter(this, id);
  }

  saveCategory = async () => {
    const category = await this.presenter.saveCategory();
    const { navigation } = this.props;
    navigation.state.params.onBack(category);
    navigation.goBack();
  }

  setName = (name) => {
    this.presenter.setName(name);
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
      <View>
        <TextInput
          placeholder="Nome"
          onChangeText={this.setName}
          value={this.state.category.name}
          style={[ defaultStyles.textInput, defaultStyles.verticalMargin ]}
        />
        { this.state.validationError
          ? <Text>{this.state.validationError}</Text>
          : null }
        { this.state.category.id ? (
          <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
            ID: {this.state.category.id}
          </Text>
        )
          : null}
      </View>
    );
  }
}
