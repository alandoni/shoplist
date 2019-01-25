import React from 'react';
import { StyleSheet, TextInput, Text, View, Button, ActivityIndicator, Picker } from 'react-native';
import DataManager from '../controllers/DataManager';
import AbstractRequestScreen from './AbstractRequestScreen';
import defaultStyles from '../utils/styles';

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
		const data = {};
		return DataManager.getAllCategories(categories).then((categories) => {
			data.categories = categories;
			return this.requestProductIfNeeded();
		}).then((product) => {
			if (product) {
				data.product = product;
			}
			return data;
		});
	}

	requestProductIfNeeded = () => {
		if (this.state.id) {
			return DataManager.getProductById(this.state.id);
		} else {
			return Promise.resolve(null);
		}
	}

	onDataRequested(data, error) {
		if (data) {
			const category = data.categories[0];
			if (data.product) {
				data.name = data.product.name;
				data.value = data.product.value;
				data.category.id = data.product.category;
				data.notes = data.product.notes;
			}
			this.setState({data, category, error, isLoading: false, refresh: !this.state.refresh });
		} else {
			super.onDataRequested(data, error);
		}
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
				this.state.notes,
				this.state.category.id,
				);
		} else {
			return DataManager.saveProduct(
				this.state.name,
				this.state.value,
				this.state.notes,
				this.state.category.id,
				);
		}
	}

	newCategory = () => {
		this.props.navigation.navigate('NewCategory', { onBack: (category) => this.addCategory(category) });
	}

	addCategory = (category) => {
		const { categories } = this.state.data;
		categories.push(category);

		const { data } = this.state;
		data.categories = categories;
		console.log(categories);
		this.setState({data, category});
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
				{this.state.id ? 
					<Text>ID: {this.state.id}</Text>
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
					{this.state.data.categories.map((category) => {
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