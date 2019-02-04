import React from 'react';
import {
  TextInput,
  Text,
  View,
} from 'react-native';
import AbstractRequestScreen from './AbstractRequestScreen';
import { defaultStyles } from '../utils/styles';
import DataManager from '../controllers/DataManager';
import { NavigationButton, ProgressView, ErrorView } from '../utils/custom-views-helper';

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

  constructor(props) {
    super(props);

    this.state = { name: '', value: '' };
  }

  componentDidMount() {
    super.componentDidMount();
    this.props.navigation.setParams({ saveCategory: this.saveCategory });
    this.setState({ id: this.props.navigation.getParam('id', null) });
  }

  saveCategory = () => {
    this.setState({ isLoading: true }, () => {
      this.saveOrUpdate().then((category) => {
        const { navigation } = this.props;
        navigation.state.params.onBack(category[0]);
        navigation.goBack();
      }).catch((error) => {
        this.setState({ error, isLoading: false });
      });
    });
  }

  saveOrUpdate() {
    if (this.state.id) {
      return DataManager.updateCategory(this.props.id, this.state.name);
    }
    return DataManager.saveCategory(this.state.name);
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
          onChangeText={(text) => { this.setState({ name: text }); }}
          value={this.state.name}
          style={[ defaultStyles.textInput, defaultStyles.verticalMargin ]}
        />
        { this.state.validationError
          ? <Text>{this.state.validationError}</Text>
          : null }
        { this.state.id ? (
          <Text style={[ defaultStyles.lessRelevant, defaultStyles.marginBottom, defaultStyles.marginLeft ]}>
            ID:
            {' '}
            {this.state.id}
          </Text>
        )
          : null}
      </View>
    );
  }
}
