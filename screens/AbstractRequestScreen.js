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
        if (!this.requestData()) {
            this.setState({isLoading: false});
            return;
        }
		this.setState({isLoading: true}, () => {
            return this.requestData().then((data) => {
                this.onDataRequested(data, null);
                this.finishedRequestingData(data);
            }).catch((error) => {
                this.onDataRequested(null, error);
            });
        });
    }
    
    requestData() {

    }

    finishedRequestingData(data) {

    }

	onDataRequested(data, error) {
		this.setState({data, error, isLoading: false, refresh: !this.state.refresh});
	}

}