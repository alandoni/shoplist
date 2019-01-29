import React from 'react';
import {
  TextInput,
  Text,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import AbstractRequestScreen from './AbstractRequestScreen';
import defaultStyles from '../utils/styles';
import DataManager from '../controllers/DataManager';

export default class NewCategoryScreen extends AbstractRequestScreen {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Nova Categoria',
      headerRight: (
        <Button
          title="Salvar"
          onPress={() => params.saveCategory()}
        />
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
      return (
        <View style={[ defaultStyles.container, defaultStyles.horizontal ]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return (
      <View>
        {this.props.id
          ? (
            <Text>
              ID:
              {this.props.id}
            </Text>
          )
          : null}
        <TextInput
          placeholder="Nome"
          onChangeText={(text) => { this.setState({ name: text }); }}
          value={this.state.name}
        />
      </View>
    );
  }
}
