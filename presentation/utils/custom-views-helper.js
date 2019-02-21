import React from 'react';
import { FloatingAction } from 'react-native-floating-action';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { defaultStyles, colors } from './styles';

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
        color={colors.red}
        overrideWithAction
        actions={actions}
        onPressItem={() => this.onPress()}
      />
    );
  }
}

function ErrorView(props) {
  return (
    <View style={defaultStyles.fullHeight}>
      <Text>{props.error.message}</Text>
    </View>
  );
}

function ProgressView() {
  return (
    <View style={defaultStyles.fullHeight}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

function MenuButton() {
  return (
    <Image style={[ defaultStyles.menuButton ]} source={require('../assets/menu.png')} />
  );
}

function NavigationButton(props) {
  return (
    <TouchableOpacity onPress={() => props.onPress()}>
      <Text style={defaultStyles.navigationButton}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

export {
  FloatingActionButton, ErrorView, ProgressView, MenuButton, NavigationButton,
};
