import React from 'react';
import { FloatingAction } from 'react-native-floating-action';
import {
  Text,
} from 'react-native';

class FloatingActionButton extends React.Component {
  onPress = () => {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  render() {
    const actions = [ {
      text: 'Plus',
      name: 'plus',
      icon: require('../assets/icon.png'),
      position: 1,
    } ];
    return (
      <FloatingAction
        color="#f4511e"
        overrideWithAction
        actions={actions}
        onPressItem={() => this.onPress()}
      />
    );
  }
}

class ErrorView extends React.Component {
  render() {
    return (
      <Text>{this.props.error.message}</Text>
    );
  }
}

export { FloatingActionButton, ErrorView };
