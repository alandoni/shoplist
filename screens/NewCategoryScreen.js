import React from 'react';
import { StyleSheet, TextInput, View, Button, ActivityIndicator } from 'react-native';
import AbstractRequestScreen from './AbstractRequestScreen';

export default class NewCategoryScreen extends AbstractRequestScreen {
	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		return {
			title: 'Nova Categoria',
			headerRight: (
				<Button 
					title="Salvar"
					onPress={() => params.saveCategory()} />
			),
		};
	};

	constructor(props) {
		super(props);

		this.state = {name: '', value: ''};
	}

	componentDidMount() {
		super.componentDidMount();
		this.props.navigation.setParams({ saveCategory: this.saveCategory });
		this.setState({id: this.props.navigation.getParam('id', null)});
	}

	saveCategory = () => {
		this.setState({isLoading: true}, () => {
			this.saveOrUpdate().then((Category) => {
				this.props.navigation.state.params.onBack(Category);
				this.props.navigation.goBack();
			}).catch((error) => {
				this.setState({error, isLoading: false});
			});
		});
	}

	saveOrUpdate() {
		if (this.state.id) {
			return DataManager.updateCategory(this.props.id, this.state.name, this.state.products);
		} else {
			return DataManager.saveCategory(this.state.name, this.state.products);
		}
	}

	render() {
		if (this.state.isLoading) {
			return (
				<View style={[styles.container, styles.horizontal]}>
					<ActivityIndicator size="large" color="#0000ff" />
				</View>
			);
		}
		return (
			<View>
				{this.props.id ? 
					<Text>ID: {this.props.id}</Text>
				: null}
				<TextInput 
					placeholder="Nome"
					onChangeText={(text) => { this.setState({name: text}) }}
					value={this.state.name}
				/>
			</View>
		);
	}
}