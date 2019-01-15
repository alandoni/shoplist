import React from 'react';
import { FloatingAction } from 'react-native-floating-action';

class FloatingActionButton extends React.Component {

	constructor(props) {
		super(props);
	}

	onPress = () => {
		if (this.props.onPress) {
			this.props.onPress();
		}
	}

	render() {
		const actions = [{
			text: 'Plus',
			name: 'plus',
			icon: require('./assets/icon.png'),
			position: 1
		}];
		return (
			<FloatingAction
				color="#f4511e"
				overrideWithAction
				actions={actions}
				onPressItem={(name) => this.onPress()} />
		)
	}
}

export { FloatingActionButton };
