import DataManager from './DataManager';

export default class OrderPresenter {
  constructor(id, shopListId, name) {
    const date = new Date();
    this.order = {
      id, shopListId, name, date, products: [], totalValue: 0, amountProducts: 0,
    };
  }

  async getOrder() {
    if (this.order.id) {
      this.order = await DataManager.getOrderById(this.order.id);
    } else {
      const shopList = await DataManager.getShopListById(this.order.shopListId);
      this.order.shopListId = shopList.id;
      this.order.name = shopList.name;
      this.order.products = shopList.products;
      this.order.totalValue = shopList.totalValue;
      this.order.amountProducts = shopList.amountProducts;
    }
    return this.order;
  }

  async saveOrder() {
    if (this.order.id) {
      this.order = await DataManager.updateOrder(this.order.id,
        this.order.shopListId,
        this.order.date,
        this.order.products);
    } else {
      this.order = await DataManager.saveOrder(this.order.shopListId, this.order.date, this.order.products);
    }
    return this.order;
  }

  async addProductToTheList(product) {
    this.order = await this.saveOrder();
    const newProduct = product;
    newProduct.amount = 1;
    newProduct.totalValue = product.amount * product.value;
    this.order.products.push(newProduct);
    return this.order;
  }

  async updateProductInTheList(product, amount, value) {
    const storedProduct = await DataManager.updateProductInOrder(product.id, amount, value);
    const newProduct = storedProduct;
    newProduct.totalValue = storedProduct.amount * storedProduct.value;
    this.order.products.setElement(newProduct, element => element.id === newProduct.id);
    return this.order;
  }

  async deleteProductFromList(product) {
    await DataManager.removeProductFromOrder(product.id);
    this.order.products = this.order.products.filter(value => value.id !== product.id);
    return this.order;
  }
}
