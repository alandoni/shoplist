import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';
import NewProductScreen from './screens/NewProductScreen';
import NewListScreen from './screens/NewListScreen';
import SearchProductScreen from './screens/SearchProductScreen';
import BuyActionScreen from './screens/BuyActionScreen';
import NewCategoryScreen from './screens/NewCategoryScreen';

import { MenuProvider } from 'react-native-popup-menu';

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    NewProduct: {
      screen: NewProductScreen
    },
    NewList: {
      screen: NewListScreen
    },
    NewCategory: {
      screen: NewCategoryScreen
    },
    SearchProduct: {
      screen: SearchProductScreen
    },
    BuyAction: {
      screen: BuyActionScreen
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
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return (
      <MenuProvider>
        <AppContainer />
      </MenuProvider>
    )
  }
}
