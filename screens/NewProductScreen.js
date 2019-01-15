import React from 'react';
import { StyleSheet, TextInput, View, Button, ActivityIndicator } from 'react-native';
import DataManager from '../controllers/DataManager';
import AbstractRequestScreen from './AbstractRequestScreen';

export default class NewProductScreen extends AbstractRequestScreen {
	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		return {
			title: 'Novo Produto',
			headerRight: (
				<Button 
					title="Salvar"
					onPress={() => params.saveProduct()} />
			),
		};
	};

	componentDidMount() {
		this.props.navigation.setParams({ saveProduct: this.saveProduct });
		this.setState({id: this.props.navigation.getParam('id', null)});
		super.componentDidMount();
	}

	saveProduct = () => {
		this.setState({isLoading: true}, () => {
			return this.saveOrUpdate().then((product) => {
				this.props.navigation.state.params.onBack(product);
				this.props.navigation.goBack();
			});
		});
	}

	saveOrUpdate() {
		if (this.state.id) {
			return DataManager.updateProduct(
				this.props.id,
				this.state.name,
				this.state.value,
				this.state.category,
				this.state.notes);
		} else {
			return DataManager.saveProduct(
				this.state.name,
				this.state.value,
				this.state.category,
				this.state.notes);
		}
	}

	newCategory = () => {
		this.props.navigation.navigate('NewCategory', {onBack: (category) => this.setState({category})})
	}

	render() {
		if (this.state.isLoading) {
			return (
				<View>
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
				<TextInput 
					placeholder="Valor"
					onChangeText={(text) => { this.setState({value: text}) }}
					value={this.state.value}
				/>
				<TextInput 
					placeholder="Categoria"
					onChangeText={(text) => { this.setState({category: text}) }}
					value={this.state.category}
				/>
				<Button title="Nova Categoria" onPress={this.newCategory} />
				<TextInput 
					placeholder="Observação"
					onChangeText={(text) => { this.setState({notes: text}) }}
					value={this.state.notes}
				/>
			</View>
		);
	}
}