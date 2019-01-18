import React from 'react';
import { 
  StyleSheet, 
  TextInput,
  Text, 
  View, 
  Button, 
  ActivityIndicator, 
  Picker, 
  Modal } from 'react-native';
import DataManager from '../controllers/DataManager';
import defaultStyles from '../styles';

export default class EditProductInListModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      id: this.props.product.id,
      amount: this.props.product.amount,
      value: this.props.product.value,
    };
  }

  closeModal() {
    if (this.props.onCloseModal) {
      this.props.onCloseModal(this.state);
    }
  }
  
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.visible}>
        <View style={{marginTop: 22}}>
          <View>
            <Text>{this.props.product.name}</Text>
            <TextInput 
              placeholder="Quantidade"
              onChangeText={(text) => { this.setState({amount: text}) }}
              value={this.state.amount}
            />
            <TextInput
              placeholder="Valor"
              onChangeText={(text) => { this.setState({value: text}) }}
              value={this.state.value}
            />
            <TouchableHighlight
              onPress={() => {
                this.closeModal();
              }}>
              <Text>Salvar</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }
}