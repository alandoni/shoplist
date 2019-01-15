import React from 'react';
import { StyleSheet, View, FlatList, Text, TextInput, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FloatingActionButton } from '../custom-views-helper';
import defaultStyles from '../styles';
import AbstractRequestScreen from './AbstractRequestScreen';
import DataManager from '../controllers/DataManager';

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

export default class SearchProductScreen extends AbstractRequestScreen {
	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Procurar Produto',
			headerRight: (
				<Button 
					title="+"
					onPress={() => navigation.navigate('NewProduct')} />
			)
		}
	};

	requestData() {
		if (!this.state.text || this.state.text.length === 0) {
			return DataManager.getAllProducts();
		} else {
			return DataManager.searchProductByName(this.state.text)
		}
	}

	createNewProduct = () => {
		this.props.navigation.navigate('NewProduct', {
			backTo: this.props.navigation.getParam('backTo', 'SearchProduct'),
			onBack: () => { 
				this.request();
			}
		});
	}

	searchProduct(text) {
		this.setState({text}, () => {
			this.request();
		});
	}

	selectItem(item) {
		const { navigation } = this.props;
		navigation.state.params.onBack(item);
		this.props.navigation.goBack();
	}

	renderItem({item}) {
		return (
			<TouchableOpacity onPress={() => this.selectItem(item)} >
				<Text style={styles.item}>{item.name}</Text>
			</TouchableOpacity>
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
		if (this.state.error) {
			return (
				<View style={[styles.container, styles.horizontal]}>
					<Text>this.state.error</Text>
				</View>
			);
		}
		return (
			<View style={defaultStyles.fullHeght}>
				<TextInput 
					placeholder="Procurar produto"
					onChangeText={(text) => { this.searchProduct(text) }}
					value={this.state.text}
				/>
				<FlatList
					data={this.state.data}
					extraData={this.state.refresh}
					renderItem={this.renderItem.bind(this)}
					keyExtractor={(item) => item.id}
					style={defaultStyles.fullHeght}
				/>
				<FloatingActionButton onPress={this.createNewProduct} />
			</View>
		);
	}
}