import DataManager from './DataManager';
import { ValidationError } from '../utils/utils';

export default class NewListPresenter {
  constructor(name, id) {
    this.shopList = {
      name, id, products: [], amountProducts: 0, totalValue: 0,
    };
  }

  async requestShopList() {
    if (!this.shopList.id) {
      return this.shopList;
    }
    const shopList = await DataManager.getShopListById(this.id);
    this.shopList = shopList;
    return this.shopList;
  }

  async saveShopList() {
    if (this.shopList.name.length < 2) {
      throw new ValidationError('Por favor, digite um nome válido!' );
    }

    if (this.shopList.id) {
      this.shopList = await DataManager.updateShopList(this.id, this.name, this.products);
    } else {
      this.shopList = await DataManager.saveShopList(this.name, this.shopList.products);
    }
    return this.shopList;
  }

  async addProductToTheList(product) {
    const newProduct = product;
    newProduct.amount = 1;
    newProduct.totalValue = product.amount * product.value;
    this.shopList.products.push(newProduct);
    this.shopList = await this.saveShopList();
    return this.shopList;
  }

  async updateProductInTheList(product, amount, value) {
    const newProduct = product;
    newProduct.totalValue = product.amount * product.value;
    this.shopList.products.setElement(newProduct, element => element.id === newProduct.id);
    await DataManager.updateProductInShopList(product.id, amount, value);
    return this.shopList;
  }

  async deleteProductFromList(product) {
    await DataManager.removeProductFromShopList(product.id);
    this.shopList.products = this.shopList.products.filter(value => value.id !== product.id);
    return this.shopList;
  }

  setName(name) {
    this.shopList.name = name;
  }
}
