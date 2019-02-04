import React from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableHighlight,
  Modal,
} from 'react-native';
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
      this.props.onRequestClose(this.state);
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
      >
        <View>
          <View>
            <Text>{this.props.product.name}</Text>
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
              style={[ defaultStyles.navigationButton, defaultStyles.verticalMargin ]}
            >
              <Text>Salvar</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }
}
