import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import NewProductScreen from './screens/NewProductScreen';
import NewListScreen from './screens/NewListScreen';
import SearchProductScreen from './screens/SearchProductScreen';
import OrderScreen from './screens/OrderScreen';
import NewCategoryScreen from './screens/NewCategoryScreen';
import { MenuProvider } from 'react-native-popup-menu';
import ProductsController from './controllers/ProductsController';
import CategoriesController from './controllers/CategoriesController';

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    NewProduct: {
      screen: NewProductScreen,
    },
    NewList: {
      screen: NewListScreen,
    },
    NewCategory: {
      screen: NewCategoryScreen,
    },
    SearchProduct: {
      screen: SearchProductScreen,
    },
    OrderAction: {
      screen: OrderScreen,
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
)

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {

  componentDidMount() {
    /*const productsController = new ProductsController();
    productsController.dropTable();

    const categoriesController = new CategoriesController();
    categoriesController.dropTable();

    categoriesController.createTable().then(() => {
      return productsController.createTable();
    }).then(() => {
      return categoriesController.insert({name: 'Casa'});
    }).then((category) => {
        productsController.insert({name: 'Arroz', value: 4.99, notes: 'OBS', category: category[0].id});
        return categoriesController.insert({name: 'Higiene'});
    }).then((category) => {
        productsController.insert({name: 'Sabonete', value: 1.19, notes: 'OBS teste', category: category[0].id});
    });*/
  }

  render() {
    return (
      <MenuProvider>
        <AppContainer />
      </MenuProvider>
    )
  }
}
