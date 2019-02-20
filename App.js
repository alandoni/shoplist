import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';
import HomeScreen from './views/HomeScreen';
import NewProductScreen from './views/NewProductScreen';
import NewListScreen from './views/NewListScreen';
import SearchProductScreen from './views/SearchProductScreen';
import OrderScreen from './views/OrderScreen';
import NewCategoryScreen from './views/NewCategoryScreen';
import CategoriesController from './models/CategoriesController';
import OrdersController from './models/OrdersController';
import ProductsController from './models/ProductsController';
import ProductsInOrdersController from './models/ProductsInOrdersController';
import ProductsInShopListsController from './models/ProductsInShopListsController';
import ShopListsController from './models/ShopListsController';
import { colors } from './utils/styles';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    NewProduct: NewProductScreen,
    NewList: NewListScreen,
    NewCategory: NewCategoryScreen,
    SearchProduct: SearchProductScreen,
    Order: OrderScreen,
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.red,
      },
      headerTintColor: colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRightContainerStyle: {
        paddingRight: 10,
        backgroundColor: colors.red,
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
