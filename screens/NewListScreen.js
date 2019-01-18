import React from 'react';
import { StyleSheet, TouchableHighlight, View, Text, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import { FloatingActionButton } from '../utils/custom-views-helper';

import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
} from 'react-native-popup-menu';
import DataManager from '../controllers/DataManager';
import AbstractRequestScreen from './AbstractRequestScreen';
import defaultStyles from '../utils/styles';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default class NewListScreen extends AbstractRequestScreen {
	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state;
		return {
			title: 'Editar Lista de Compras',
			headerRight: (
				<Button 
					title="Salvar"
					onPress={() => params.saveShopList()} />
			),
		};
	};

	componentDidMount() {
		this.props.navigation.setParams({ saveShopList: this.saveShopList });
		
		const name = this.props.navigation.getParam('name', '');
		const id = this.props.navigation.getParam('id', null);

		this.setState({
			name, 
			id,
			products: [],
		});
		this.setState();
		super.componentDidMount();
	}
	
	requestData() {
		if (this.state.id) {
			return DataManager.getShopListById(this.state.id);
		}
		return Promise.resolve(null);
	}

	finishedRequestingData(data) {
		if (data) {
			this.setState({name: data.name, products: data.products, refresh: !this.state.refresh});
		}
	}

	saveShopList = () => {
		this.setState({isLoading: true}, () => {
			this.saveOrUpdate().then((shopList) => {
				console.log('saved');
				this.props.navigation.state.params.onBack(shopList);
				this.props.navigation.goBack();
			}).catch((error) => {
				this.setState({error, isLoading: false});
			});
		});
	}

	saveOrUpdate = () => {
		if (this.state.id) {
			console.log('update');
			return DataManager.updateShopList(this.props.id, this.state.name, this.state.products);
		} else {
			console.log('saving');
			return DataManager.saveShopList(this.state.name, this.state.products);
		}
	}

	newProduct = () => {
		const { navigate } = this.props.navigation;
		navigate('SearchProduct', {
			backTo: 'NewListScreen', 
			onBack: this.addProductToTheList
		});
	}

	addProductToTheList = (product) => {
		const { products } = this.state;
		products.push(product);
		this.setState({products, refresh: !this.state.refresh});
	}

	editAmount = (item) => {
		alert('NOT YET IMPLEMENTED');
	}

	removeProductFromShopListWithConfirmation = (item) => {
		Alert.alert(
			'Atenção!',
			'Tem certeza que quer excluir esse produto da lista? (isso não excluirá o produto do sistema)',
			[
				{
					text: 'Excluir',
					onPress: () => {
						this.deleteProductFromShopList(item);
					},
				},
				{
					text: 'Cancelar',
				},
			],
		);
	}

	deleteProductFromShopList = (item) => {
		this.setState({isLoading: true}, () => {
			return DataManager.removeProductFromShopList(item.id).then(() => {
				const list = this.state.products;
				return list.filter((value) => {
					return value.id !== item.id;
				});
			}).then((newList) => {
				this.setState({isLoading: false, products: newList, refresh: !this.state.refresh});
			});
		});
	}

	renderItem = ({item}) => {
		return (
			<TouchableHighlight>
				<View>
					<Text>{item.name} - </Text>
					<Text>{item.value} - </Text>
					<Text>{item.amount} - </Text>
					<Text>{item.totalValue}</Text>
					<Menu>
					<MenuTrigger>
						<Text>...</Text>
					</MenuTrigger>
					<MenuOptions>
						<MenuOption onSelect={() => this.editAmount(item)} text='Editar Quantidade' />
						<MenuOption onSelect={() => this.removeProductFromShopListWithConfirmation(item)} >
							<Text style={{color: 'red'}}>Excluir</Text>
						</MenuOption>
					</MenuOptions>
				</Menu>
				</View>
			</TouchableHighlight >
		)
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
			<View style={defaultStyles.fullHeght}>
				<TextInput 
					placeholder="Descrição"
					onChangeText={(text) => { this.setState({name: text}) }}
					value={this.state.name}
				/>
				{ this.props.id ?
						<Text>ID: {this.props.id}</Text>
				: null }
				<FlatList
					data={this.state.products}
					extraData={this.state.refresh}
					renderItem={this.renderItem}
					keyExtractor={(item) => item.id}
					style={defaultStyles.fullHeght}
				/>
				<FloatingActionButton onPress={this.newProduct} />
			</View>
		);
	}
}