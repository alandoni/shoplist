import DataManager from './DataManager';
import { ValidationError } from '../utils/utils';

export default class NewListPresenter {
  constructor(name, id) {
    this.shopList = {
      name, id, products: [], amount: 0, totalValue: 0,
    };
  }

  requestShopList() {
    if (!this.id) {
      return Promise.resolve(this.shopList);
    }
    return DataManager.getShopListById(this.id).then((shopList) => {
      this.shopList = shopList;
      return this.shopList;
    });
  }

  saveShopList() {
    if (this.name.length < 2) {
      throw new ValidationError('Por favor, digite um nome válido!' );
    }

    return this.saveOrUpdate().then((shopList) => {
      this.shopList = shopList;
      return this.shopList;
    });
  }

  saveOrUpdate = () => {
    if (this.id) {
      return DataManager.updateShopList(this.id, this.name, this.products);
    }
    return DataManager.saveShopList(this.name, this.products);
  }

  addProductToTheList = product => this.saveShopList().then((shopList) => {
    const newProduct = product;
    newProduct.amount = 1;
    newProduct.totalValue = product.amount * product.value;
    this.shopList.products.push(newProduct);
    return shopList;
  });

  updateProductInTheList = (product, amount, value) => DataManager.updateProductInShopList(product.id, amount, value)
    .then((storedProduct) => {
      const newProduct = storedProduct;
      newProduct.totalValue = storedProduct.amount * storedProduct.value;
      this.shopList.products.setElement(newProduct, element => element.id === newProduct.id);
      return this.shopList;
    });

  deleteProductFromList = product => DataManager.removeProductFromShopList(product.id).then(() => {
    this.shopList.products = this.shopList.products.filter(value => value.id !== product.id);
    return this.shopList;
  });
}
