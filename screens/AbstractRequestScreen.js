import React from 'react';

export default class AbstractRequestScreen extends React.Component {
	constructor(props) {
		super(props);
		const name = props.navigation.getParam('name', '');
		const id = props.navigation.getParam('id', '');

		this.state = {
			isLoading: true, error: null, data: null
		};
	}

	componentDidMount() {
		this.request();
	}

	request() {
		const request = this.requestData();
		if (!request) {
			this.setState({ isLoading: false });
			return;
		}
		this.setState({ isLoading: true }, () => {
			request.then((data) => {
				return this.onDataRequested(data, null);
			}).catch((error) => {
				this.onDataRequested(null, error);
			});
		});
	}

	requestData() {
		return null;
	}

	onDataRequested(data, error) {
		this.setState({ data, error, isLoading: false, refresh: !this.state.refresh });
	}
}