import React from 'react';
import { 
	StyleSheet, 
	TouchableHighlight, 
	View, 
	Text, 
	TextInput, 
	Button,
	FlatList,
	ActivityIndicator, 
	Alert
} from 'react-native';
import { FloatingActionButton } from '../utils/custom-views-helper';
import EditProductInListModal from './EditProductInListModal';
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
					onPress={() => params.saveShopList(true)} />
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
		}, () => {
			super.componentDidMount();
		});
	}
	
	requestData() {
		if (this.state.id) {
			return DataManager.getShopListById(this.state.id);
		}
		return Promise.resolve(null);
	}

	onDataRequested(data, error) {
		if (data) {
			this.setState({name: data.name, products: data.products, error, isLoading: false, refresh: !this.state.refresh});
		} else {
			super.onDataRequested(data, error);
		}
	}

	saveShopList = (close) => {
		if (this.state.name.length < 2) {
			this.setState({error: 'Por favor, digite um nome válido!'});
			return;
		}

		this.setState({isLoading: true}, () => {
			this.saveOrUpdate().then((shopList) => {
				if (close) {
					this.props.navigation.state.params.onBack(shopList);
					this.props.navigation.goBack();
				} else {
					this.setState({id: shopList.id, isLoading: false});
				}
			}).catch((error) => {
				this.setState({error, isLoading: false});
			});
		});
	}

	saveOrUpdate = () => {
		if (this.state.id) {
			return DataManager.updateShopList(this.state.id, this.state.name, this.state.products);
		} else {
			return DataManager.saveShopList(this.state.name, this.state.products);
		}
	}

	selectProduct = (product) => {
		this.setState({selectedProduct: product, modalVisible: true});
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
		product.amount = 1;
		product.totalValue = product.amount * product.value;
		products.push(product);
		this.setState({products, refresh: !this.state.refresh}, () => {
			this.saveShopList(false);
		});
	}

	editAmountAndPrice = (item) => {
		setState({modalVisible: true, selectedProduct: item});
	}

	updateProduct = (product) => {
		product.totalValue = product.amount * product.value;
		this.setState({isLoading: true}, () => {
			DataManager.updateProductInShopList(product.id, product.amount, product.value).then((product) => {
				const list = this.state.products;
				list.forEach(value => {
					if (value.id === item.id) {
						value = product;
					}
				});
				return list;
			}).then((list) => {
				this.setState({isLoading: false, products: list, refresh: !this.state.refresh});
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
			<TouchableHighlight onPress={() => { this.selectProduct(item) }}>
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
						<MenuOption onSelect={() => this.editProduct(item)} text='Editar Produto' />
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
				{ this.state.selectedProduct ? 
					<EditProductInListModal
						product={this.state.selectedProduct}
						visible={this.state.modalVisible}
						onRequestClose={(product) => this.updateProduct(product)}
					/>
				: null }
				<TextInput 
					placeholder="Descrição"
					onChangeText={(text) => { this.setState({name: text}) }}
					value={this.state.name}
				/>				
				{ this.state.error ?
					<Text>{this.state.error}</Text> 
				: null }
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