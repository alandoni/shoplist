import React from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import { defaultStyles } from '../utils/styles';

export default class EditProductInListModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 1,
      value: 1,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      amount: newProps.product.amount,
      value: newProps.product.value,
    });
  }

  closeModal() {
    if (this.props.onRequestClose) {
      console.log(this.state);
      this.props.onRequestClose(this.state);
    }
  }

  render() {
    return (
      <Modal
        transparent={false}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
        avoidKeyboard={true}
        style={defaultStyles.modal}
      >
        <View style={defaultStyles.fill}>
          <Text style={[defaultStyles.marginLeft, defaultStyles.listItemTitle]}>{this.props.product.name}</Text>
          <TextInput
            placeholder="Quantidade"
            onChangeText={(text) => { this.setState({ amount: text }); }}
            value={`${this.state.amount}`}
            style={[ defaultStyles.textInput ]}
          />
          <TextInput
            placeholder="Valor"
            onChangeText={(text) => { this.setState({ value: text }); }}
            value={`${this.state.value}`}
            style={[ defaultStyles.textInput ]}
          />
          <TouchableHighlight
            onPress={() => {
              this.closeModal();
            }}
            style={[ defaultStyles.verticalMargin ]}
          >
            <Text style={defaultStyles.button}>Salvar</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  }
}
