import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';
import HomeScreen from './screens/HomeScreen';
import NewProductScreen from './screens/NewProductScreen';
import NewListScreen from './screens/NewListScreen';
import SearchProductScreen from './screens/SearchProductScreen';
import OrderScreen from './screens/OrderScreen';
import NewCategoryScreen from './screens/NewCategoryScreen';
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
    },
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
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  componentDidMount() {
    this.createTables();
  }

  createTables = async () => {
    const categoriesController = new CategoriesController();
    const ordersController = new OrdersController();
    const productsController = new ProductsController();
    const productsInOrdersController = new ProductsInOrdersController();
    const productsInShopListsController = new ProductsInShopListsController();
    const shopListsController = new ShopListsController();

    await categoriesController.createTable();
    await productsController.createTable();
    await shopListsController.createTable();
    await ordersController.createTable();
    await productsInOrdersController.createTable();
    return productsInShopListsController.createTable();
  }

  dropTables = async () => {
    const categoriesController = new CategoriesController();
    const ordersController = new OrdersController();
    const productsController = new ProductsController();
    const productsInOrdersController = new ProductsInOrdersController();
    const productsInShopListsController = new ProductsInShopListsController();
    const shopListsController = new ShopListsController();

    await categoriesController.dropTable();
    ordersController.dropTable();
    productsController.dropTable();
    productsInOrdersController.dropTable();
    productsInShopListsController.dropTable();
    productsInShopListsController.dropTable();
    shopListsController.dropTable();
  }

  render() {
    return (
      <MenuProvider>
        <AppContainer />
      </MenuProvider>
    );
  }
}
