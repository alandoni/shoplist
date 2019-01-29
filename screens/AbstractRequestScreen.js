import React from 'react';

export default class AbstractRequestScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true, error: null, data: null,
    };
  }

  componentDidMount() {
    this.request();
  }

  onDataRequested(data, error) {
    const { refresh } = this.state;
    this.setState({
      data, error, isLoading: false, refresh: !refresh,
    });
  }

  requestData = () => null

  request() {
    const request = this.requestData();
    if (!request) {
      this.setState({ isLoading: false });
      return;
    }
    this.setState({ isLoading: true }, () => {
      request.then(data => this.onDataRequested(data, null)).catch((error) => {
        this.onDataRequested(null, error);
      });
    });
  }
}
