import React from 'react';
import {
  TextInput,
  Text,
  View,
} from 'react-native';
import AbstractRequestScreen from './AbstractRequestScreen';
import { defaultStyles } from '../utils/styles';
import { NavigationButton, ProgressView, ErrorView } from '../utils/custom-views-helper';
import NewCategoryPresenter from '../controllers/NewCategoryPresenter';

export default class NewCategoryScreen extends AbstractRequestScreen {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Nova Categoria',
      headerRight: (
        <NavigationButton onPress={() => params.saveCategory()} title="Salvar" />
      ),
    };
  };

  componentDidMount() {
    super.componentDidMount();
    this.props.navigation.setParams({ saveCategory: this.saveCategory });
    const id = this.props.navigation.getParam('id', null);
    this.setState({ id });
    this.presenter = new NewCategoryPresenter(id);
  }

  saveCategory = () => {
    this.setState({ isLoading: true }, () => {
      this.presenter.saveCategory().then((category) => {
        const { navigation } = this.props;
        navigation.state.params.onBack(category);
        navigation.goBack();
      }).catch((error) => {
        this.setState({ error, isLoading: false });
      });
    });
  }

  setName = (name) => {
    this.presenter.setName(name);
    this.setState({ name });
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
          value={this.state.name}
          style={[ defaultStyles.textInput, defaultStyles.verticalMargin ]}
        />
        { this.state.validationError
          ? <Text>{this.state.validationError}</Text>
          : null }
        { this.state.id ? (
          <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
            ID: {this.state.id}
          </Text>
        )
          : null}
      </View>
    );
  }
}
