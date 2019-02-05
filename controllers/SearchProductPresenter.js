import DataManager from './DataManager';

export default class SearchProductPresenter {
  constructor() {
    this.products = [];
    this.search = '';
  }

  async getProducts() {
    if (!this.search || this.search.length === 0) {
      this.products = await DataManager.getAllProducts();
    } else {
      this.products = await DataManager.searchProductByName(this.search);
    }
    return this.products;
  }

  search(search) {
    this.search = search;
  }

  async deleteProduct(product) {
    await DataManager.removeProduct(product.id);
    this.products.filter(value => value.id !== product.id);
    return this.products;
  }
}
