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
		console.log(data);
		this.setState({name: data.name, data: data.products, refresh: !this.state.refresh});
	}

	renderItem({item}) {
		const { navigate } = this.props.navigation;
		return (
			<TouchableHighlight  onPress={() => navigate('BuyAction', {name: item.name, id: item.key})}>
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
							<MenuOption onSelect={() => navigate('NewProduct', {name: item.name, id: item.key})} text='Editar' />
							<MenuOption onSelect={() => alert(`Excluir`)} >
								<Text style={{color: 'red'}}>Excluir</Text>
							</MenuOption>
						</MenuOptions>
					</Menu>
				</View>
			</TouchableHighlight >
		)
	}

	searchProduct = () => {

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
				<FloatingActionButton onPress={this.searchProduct} />
			</View>
		);
	}
}

// <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />