import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import NewProductScreen from './screens/NewProductScreen';
import NewListScreen from './screens/NewListScreen';
import SearchProductScreen from './screens/SearchProductScreen';
import OrderScreen from './screens/OrderScreen';
import NewCategoryScreen from './screens/NewCategoryScreen';
import { MenuProvider } from 'react-native-popup-menu';
import CategoriesController from './controllers/CategoriesController';
import OrdersController from './controllers/OrdersController';
import ProductsController from './controllers/ProductsController';
import ProductsInOrdersController from './controllers/ProductsInOrdersController';
import ProductsInShopListsController from './controllers/ProductsInShopListsController';
import ShopListsController from './controllers/ShopListsController';

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
    this.createTables();
  }

  createTables() {
    const categoriesController = new CategoriesController();
    const ordersController = new OrdersController();
    const productsController = new ProductsController();
    const productsInOrdersController = new ProductsInOrdersController();
    const productsInShopListsController = new ProductsInShopListsController();
    const shopListsController = new ShopListsController();

    return categoriesController.createTable().then(() => {
      return productsController.createTable();
    }).then(() => {
      return shopListsController.createTable();
    }).then(() => {
      return ordersController.createTable();
    }).then(() => {
      return productsInOrdersController.createTable();
    }).then(() => {
      return productsInShopListsController.createTable();
    });
  }

  dropTables() {
    const categoriesController = new CategoriesController();
    const ordersController = new OrdersController();
    const productsController = new ProductsController();
    const productsInOrdersController = new ProductsInOrdersController();
    const productsInShopListsController = new ProductsInShopListsController();
    const shopListsController = new ShopListsController();
    
    return categoriesController.dropTable().then(() => {
      ordersController.dropTable();
    }).then(() => {
      productsController.dropTable();
    }).then(() => {
      productsInOrdersController.dropTable();
    }).then(() => {
      productsInShopListsController.dropTable();
    }).then(() => {
      productsInShopListsController.dropTable();
    }).then(() => {
      shopListsController.dropTable();
    });
  }

  render() {
    return (
      <MenuProvider>
        <AppContainer />
      </MenuProvider>
    )
  }
}
