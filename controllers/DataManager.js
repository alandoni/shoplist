import ProductsController from '../models/ProductsController';
import CategoriesController from '../models/CategoriesController';
import ShopListsController from '../models/ShopListsController';
import OrdersController from '../models/OrdersController';
import ProductsInShopListsController from '../models/ProductsInShopListsController';
import ProductsInOrdersController from '../models/ProductsInOrdersController';

export default class DataManager {
  // Products
  static getAllProducts() {
    return new ProductsController().selectAll();
  }

  static getProductById(id) {
    return new ProductsController().selectById(id);
  }

  static searchProductByName(name) {
    return new ProductsController().selectByName(name);
  }

  static saveProduct(name, value, notes, category) {
    const product = {
      name, notes, value, category,
    };
    return new ProductsController().insert(product);
  }

  static updateProduct(id, name, value, notes, category) {
    const product = {
      name, value, notes, category,
    };
    return new ProductsController().updateById(id, product);
  }

  static removeProduct(id) {
    return new ProductsController().deleteById(id);
  }

  static removeAllProducts() {
    return new ProductsController().deleteAll();
  }

  // Categories
  static getAllCategories() {
    return new CategoriesController().selectAll();
  }

  static getCategoryById(id) {
    return new CategoriesController().selectById(id);
  }

  static searchCategoryByName(name) {
    return new CategoriesController().selectByName(name);
  }

  static saveCategory(name) {
    const category = { name };
    return new CategoriesController().insert(category);
  }

  static updateCategory(id, name) {
    const category = { name };
    return new CategoriesController().updateById(id, category);
  }

  static removeCategory(id) {
    return new CategoriesController().deleteById(id);
  }

  // ShopLists
  static getAllShopLists() {
    return new ShopListsController().selectAll();
  }

  static async getShopListById(id) {
    const shopList = await new ShopListsController().selectById(id);
    const products = await DataManager.getAllProductsInShopList(id);
    shopList.products = products.map((product) => {
      const newProduct = product;
      newProduct.totalValue = product.amount * product.value;
      return newProduct;
    });
    return shopList;
  }

  static searchShopListByName(name) {
    return new ShopListsController().selectByName(name);
  }

  static _createShopListObject(name, products) {
    if (products.length === 0) {
      return { name, totalValue: 0, amountProducts: 0 };
    }
    const productListInfo = products.reduce((accumulator, currentValue) => {
      const acc = {
        amount: (accumulator.amount += currentValue.amount),
        totalValue: (accumulator.totalValue += currentValue.totalValue),
      };
      return acc;
    });
    return { name, totalValue: productListInfo.totalValue, amountProducts: productListInfo.amount };
  }

  static async saveShopList(name, products) {
    const shopList = DataManager._createShopListObject(name, products);
    const newShopList = await new ShopListsController().insert(shopList);
    const newProducts = await DataManager.insertProductsInShopList(newShopList[0].id, products);
    newShopList.products = newProducts;
    return newShopList;
  }

  static async updateShopList(id, name, products) {
    const shopList = DataManager._createShopListObject(name, products);
    const updatedShopList = await new ShopListsController().updateById(id, shopList);
    await DataManager.removeAllProductsFromShopList(id);
    const newProducts = await DataManager.insertProductsInShopList(id, products);
    updatedShopList.products = newProducts;
    return updatedShopList;
  }

  static removeShopList(id) {
    return new ShopListsController().deleteById(id);
  }

  // Products in Shop Lists
  static getAllProductsInShopList(shopListId) {
    return new ProductsInShopListsController().select('shoplistId = ?', [ shopListId ]);
  }

  static getProductInShopList(shopListId, productId) {
    return new ProductsInShopListsController().select('shoplistId = ? AND productId = ?',
      [ shopListId, productId ]);
  }

  static insertProductsInShopList(shopListId, products) {
    return Promise.all(products.map(product => DataManager.insertProductInShopList(
      shopListId, product.id, product.amount, product.value,
    )));
  }

  static insertProductInShopList(shoplistId, productId, amount, value) {
    const productInShopList = {
      shoplistId, productId, amount, value,
    };
    return new ProductsInShopListsController().insert(productInShopList);
  }

  static updateProductInShopList(id, amount, value) {
    const productInShopList = { amount, value };
    return new ProductsInShopListsController().updateById(id, productInShopList);
  }

  static removeProductFromShopList(id) {
    return new ProductsInShopListsController().deleteById(id);
  }

  static removeAllProductsFromShopList(shopListId) {
    return new ProductsInShopListsController().delete('shopListId = ?', [ shopListId ]);
  }

  // Orders
  static getAllOrders() {
    return new OrdersController().selectAll();
  }

  static getOrderById(id) {
    return new OrdersController().selectById(id);
  }

  static _createOrderObject(shoplistId, date, products) {
    const productListInfo = products.reduce((accumulator, currentValue) => {
      const acc = {
        amount: (accumulator.amount += currentValue.amount),
        totalValue: (accumulator.totalValue += currentValue.totalValue),
      };
      return acc;
    });
    return {
      shoplistId, date, totalValue: productListInfo.totalValue, amountProducts: productListInfo.amount,
    };
  }

  static async saveOrder(shoplistId, date, products) {
    const order = DataManager._createOrderObject(shoplistId, date, products);
    const storedOrder = await new OrdersController().insert(order);
    const newProducts = await DataManager.insertProductsInOrder(storedOrder.id, products);
    storedOrder.products = newProducts;
    return products;
  }

  static async updateOrder(id, shoplistId, date, products) {
    const order = DataManager._createOrderObject(shoplistId, date, products);
    const storedOrder = await new OrdersController().updateById(id, order);
    await DataManager.removeAllProductsFromOrder(id);
    const newProducts = await DataManager.insertProductsInOrder(id, products);
    storedOrder.products = newProducts;
    return products;
  }

  static removeOrder(id) {
    return new OrdersController().deleteById(id);
  }

  // Products in Orders
  static getAllProductsInOrder(orderId) {
    return new ProductsInOrdersController().select('orderId = ?', [ orderId ]);
  }

  static getProductInOrder(orderId, productId) {
    return new ProductsInOrdersController().select('orderId = ? AND productId = ?', [ orderId, productId ]);
  }

  static insertProductsInOrder(orderId, products) {
    return Promise.all(products.map(product => DataManager.insertProductInOrder(
      orderId, product.productId, product.amount, product.value,
    )));
  }

  static insertProductInOrder(orderId, productId, amount, value) {
    const productInOrder = {
      orderId, productId, amount, value,
    };
    return new ProductsInOrdersController().insert(productInOrder);
  }

  static updateProductInOrder(id, amount, value) {
    const productInOrder = { amount, value };
    return new ProductsInOrdersController().updateById(id, productInOrder);
  }

  static removeProductFromOrder(id) {
    return new ProductsInOrdersController().deleteById(id);
  }

  static removeAllProductsFromOrder(orderId) {
    return new ProductsInOrdersController().delete('orderId = ?', [ orderId ]);
  }
}
