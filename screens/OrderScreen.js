import React from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Button, TouchableHighlight, CheckBox, ActivityIndicator } from 'react-native';
import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
} from 'react-native-popup-menu';
import { FloatingActionButton } from '../utils/custom-views-helper';
import AbstractRequestScreen from './AbstractRequestScreen';
import DataManager from '../controllers/DataManager';
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
})

export default class OrderScreen extends AbstractRequestScreen {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Comprando',
			headerRight: (
				<Button 
					title="+"
					onPress={() => navigation.navigate('SearchProduct')} />
			)
		}
	};

	requestData() {
		return DataManager.getShopListById(this.props.navigation.state.params.id);
	}

	finishedRequestingData(data) {
		if (data) {
			this.setState({name: data.name, data: data.products, isLoading: false, refresh: !this.state.refresh});
		} else {
			super.onDataRequested(data, error);
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

	selectProduct = (product) => {
		this.setState({selectedProduct: product, modalVisible: true});
	}

	removeProductFromOrderListWithConfirmation = (item) => {
		Alert.alert(
			'Atenção!',
			'Tem certeza que quer excluir esse produto da lista? (isso não excluirá o produto do sistema)',
			[
				{
					text: 'Excluir',
					onPress: () => {
						this.deleteProductFromOrder(item);
					},
				},
				{
					text: 'Cancelar',
				},
			],
		);
	}

	deleteProductFromOrder = (item) => {
		this.setState({isLoading: true}, () => {
			return DataManager.removeProductFromOrder(item.id).then(() => {
				const list = this.state.data;
				return list.filter((value) => {
					return value.id !== item.id;
				});
			}).then((newList) => {
				this.setState({isLoading: false, data: newList, refresh: !this.state.refresh});
			});
		});
	}

	editProduct = (item) => {
		this.props.navigation.navigate('NewProduct', {
			name: item.name,
			id: item.id,
			onBack: () => { 
				this.request();
			}
		});
	}

	renderItem({item}) {
		return (
			<TouchableHighlight onPress={() => this.selectProduct(item)}>
				<View>
					<CheckBox 
						title=""
						checked={item.checked}
						onValueChange={() => {}}
					/>
					<Text>{item.name} - </Text>
					<Text>{item.value}</Text>
					<Menu>
						<MenuTrigger>
							<Text>...</Text>
						</MenuTrigger>
						<MenuOptions>
							<MenuOption onSelect={() => this.editProduct(item)} text='Editar Produto' />
							<MenuOption onSelect={() => this.removeProductFromOrderListWithConfirmation(item)} >
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
				{ this.state.selectedProduct ? 
					<EditProductInListModal
						product={this.state.selectedProduct}
						visible={this.state.modalVisible}
						onCloseModal={(product) => this.updateProduct(product)}
					/>
				: null }
				<Text>{this.state.name}</Text>
				{
					this.state.id ?
						<Text>ID: {this.state.id}</Text>
					: 
						null
				}
				<FlatList
					data={this.state.data}
					extraData={this.state.refresh}
					renderItem={this.renderItem.bind(this)}
					keyExtractor={(item) => item.id}
					style={defaultStyles.fullHeght}
				/>
				<FloatingActionButton onPress={this.newProduct} />
			</View>
		);
	}
}

// <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />