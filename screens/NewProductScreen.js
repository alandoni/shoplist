import React from 'react';
import { StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Picker } from 'react-native';
import DataManager from '../controllers/DataManager';
import AbstractRequestScreen from './AbstractRequestScreen';
import defaultStyles from '../styles';

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
		super.componentDidMount();
		this.props.navigation.setParams({ saveProduct: this.saveProduct });
		this.setState({id: this.props.navigation.getParam('id', null)});
	}

	requestData() {
		return DataManager.getAllCategories();
	}

	finishedRequestingData(data) {
		this.setState({category: data[0]});
	}

	saveProduct = () => {
		this.setState({isLoading: true}, () => {
			return this.saveOrUpdate().then((product) => {
				this.props.navigation.state.params.onBack(product);
				this.props.navigation.goBack();
			}).catch((error) => {
				this.setState({error, isLoading: false});
			});
		});
	}

	saveOrUpdate() {
		if (this.state.id) {
			return DataManager.updateProduct(
				this.props.id,
				this.state.name,
				this.state.value,
				this.state.category.id,
				this.state.notes);
		} else {
			return DataManager.saveProduct(
				this.state.name,
				this.state.value,
				this.state.category.id,
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
		if (this.state.error) {
			return (
				<View style={[defaultStyles.container, defaultStyles.horizontal]}>
					<Text>{this.state.error}</Text>
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
				<Picker
					selectedValue={this.state.category}
					onValueChange={(category) => this.setState({category})}>
					{this.state.data.map((category) => {
						return <Picker.Item label={category.name} value={category} key={category.id}/>
					})}
				</Picker>
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