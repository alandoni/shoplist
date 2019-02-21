import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { MenuProvider } from 'react-native-popup-menu';

import HomeScreen from './presentation/views/HomeScreen';
/*import NewProductScreen from './presentation/views/NewProductScreen';
import NewListScreen from './presentation/views/NewListScreen';
import SearchProductScreen from './presentation/views/SearchProductScreen';
import OrderScreen from './presentation/views/OrderScreen';
import NewCategoryScreen from './presentation/views/NewCategoryScreen';*/

import CategoriesDAO from './data/database/CategoriesDAO';
import OrdersDAO from './data/database/OrdersDAO';
import ProductsDAO from './data/database/ProductsDAO';
import ProductsInOrdersDAO from './data/database/ProductsInOrdersDAO';
import ProductsInShopListsDAO from './data/database/ProductsInShopListsDAO';
import ShopListsDAO from './data/database/ShopListsDAO';

import { colors } from './presentation/utils/styles';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    /*NewProduct: NewProductScreen,
    NewList: NewListScreen,
    NewCategory: NewCategoryScreen,
    SearchProduct: SearchProductScreen,
    Order: OrderScreen,*/
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
    const categoriesDAO = new CategoriesDAO();
    const ordersDAO = new OrdersDAO();
    const productsDAO = new ProductsDAO();
    const productsInOrdersDAO = new ProductsInOrdersDAO();
    const productsInShopListsDAO = new ProductsInShopListsDAO();
    const shopListsDAO = new ShopListsDAO();

    await categoriesDAO.createTable();
    await productsDAO.createTable();
    await shopListsDAO.createTable();
    await ordersDAO.createTable();
    await productsInOrdersDAO.createTable();
    return productsInShopListsDAO.createTable();
  }

  dropTables = async () => {
    const categoriesDAO = new CategoriesDAO();
    const ordersDAO = new OrdersDAO();
    const productsDAO = new ProductsDAO();
    const productsInOrdersDAO = new ProductsInOrdersDAO();
    const productsInShopListsDAO = new ProductsInShopListsDAO();
    const shopListsDAO = new ShopListsDAO();

    await categoriesDAO.dropTable();
    ordersDAO.dropTable();
    productsDAO.dropTable();
    productsInOrdersDAO.dropTable();
    productsInShopListsDAO.dropTable();
    productsInShopListsDAO.dropTable();
    shopListsDAO.dropTable();
  }

  render() {
    return (
      <MenuProvider>
        <AppContainer />
      </MenuProvider>
    );
  }
}
