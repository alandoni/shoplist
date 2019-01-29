import ProductsController from "./ProductsController";
import CategoriesController from "./CategoriesController";
import ShopListsController from "./ShopListsController";
import ProductsInShopListsController from "./ProductsInShopListsController";

products = [
	{ name: 'Roupa', value: 'R$ 3,50', id: '1', amount: '2', totalValue: 'R$ 7,00' },
	{ name: 'Sapato', value: 'R$ 4,00', id: '2', amount: '1', totalValue: 'R$ 4,00' },
];
categories = [
	{ name: 'Casa', id: 1 },
	{ name: 'Roupa', id: 2 },
];
shopLists = [{
	name: 'Shopping', products, id: '1', totalValue: 'R$ 7,00'
}];
productsInShopLists = [];
orders = [];
orderProducts = [];

export default class DataManager {

	// Products
	static getAllProducts() {
		return new ProductsController().selectAll();
	}

	static getProductById(id) {
		return new ProductsController().selectById(products, id)
	}

	static searchProductByName(name) {
		return new ProductsController().selectByName(products, name);
	}

	static saveProduct(name, value, notes, category) {
		const product = { name, notes, value, category };
		return new ProductsController().insert(product);
	}

	static updateProduct(id, name, value, notes, category) {
		const product = { name, value, notes, category };
		return new ProductsController().updateById(id, product)
	}

	static removeProduct(id) {
		return new ProductsController().delete(id);
	}

	static removeAllProducts() {
		return new ProductsController().deleteAll();
	}

	// Categories
	static getAllCategories() {
		return new CategoriesController().selectAll();
	}

	static getCategoryById(id) {
		return new CategoriesController().selectById(id)
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
		return new CategoriesController().updateById(id, category)
	}

	static removeCategory(id) {
		return new CategoriesController().deleteById(id);
	}

	// ShopLists
	static getAllShopLists() {
		return new ShopListsController().selectAll();
	}

	static getShopListById(id) {
		let shopList = null;
		return new ShopListsController().selectById(id).then((loadedShopList) => {
			shopList = loadedShopList[0];
			return DataManager.getAllProductsInShopList(id);
		}).then((products) => {
			shopList.products = products;
			return shopList;
		});
	}

	static searchShopListByName(name) {
		return new ShopListsController().selectByName(name);
	}

	static _createShopListObject(name, products) {
		if (products.length === 0) {
			return { name, totalValue: 0, amountProducts: 0 };
		}
		const productListInfo = products.reduce((accumulator, currentValue) => {
			console.log(accumulator);
			console.log(currentValue);
			return {
				amount: (accumulator.amount += currentValue.amount),
				totalValue: (accumulator.totalValue += currentValue.totalValue)
			};
		});
		return { name, totalValue: productListInfo.totalValue, amountProducts: productListInfo.amount };
	}

	static saveShopList(name, products) {
		const shopList = DataManager._createShopListObject(name, products);
		return new ShopListsController().insert(shopList).then((newShopList) => {
			return DataManager.insertProductsInShopList(newShopList[0].id, products);
		});
	}

	static updateShopList(id, name, products) {
		const shopList = DataManager._createShopListObject(name, products);
		return new ShopListsController().updateById(id, shopList).then(() => {
			return DataManager.removeAllProductsFromShopList(id);
		}).then(() => {
			return DataManager.insertProductsInShopList(id, products);
		});
	}

	static removeShopList(id) {
		return new ShopListsController().remove(id);
	}

	// Products in Shop Lists
	static getAllProductsInShopList(shopListId) {
		return new ProductsInShopListsController().select('shoplistId = ?', [shopListId]);
	}

	static getProductInShopList(shopListId, productId) {
		return new ProductsInShopListsController().select('shoplistId = ? AND productId = ?', [shopListId, productId]);
	}

	static insertProductsInShopList(shopListId, products) {
		return Promise.all(products.map((product) => {
			return DataManager.insertProductInShopList(shopListId, product.id, product.amount, product.value);
		}));
	}

	static insertProductInShopList(shoplistId, productId, amount, value) {
		const productInShopList = { shoplistId, productId, amount, value };
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
		return new ProductsInShopListsController().delete('shopListId = ?', [shopListId])
	}

	// Orders
	static getAllOrders() {
		return new OrdersController().selectAll();
	}

	static getOrderById(id) {
		return new OrdersController().selectById(id)
	}

	static _createOrderObject(shoplistId, date, products) {
		const productListInfo = products.reduce((accumulator, currentValue) => {
			return {
				amount: (accumulator.amount += currentValue.amount),
				totalValue: (accumulator.totalValue += currentValue.totalValue)
			};
		});
		return { shoplistId, date, totalValue: productListInfo.totalValue, amountProducts: productListInfo.amount };
	}

	static saveOrder(shoplistId, date, products) {
		const order = DataManager._createOrderObject(shoplistId, date, products);
		return new OrdersController().insert(order).then((order) => {
			return insertProductsInOrder(order.id, products);
		});
	}

	static updateOrder(id, shoplistId, date, products) {
		const order = DataManager._createOrderObject(shoplistId, date, products);
		return new OrdersController().updateById(id, order).then(() => {
			return DataManager.removeAllProductsFromOrder(id);
		}).then(() => {
			return DataManager.insertProductsInOrder(id, products);
		});
	}

	static removeOrder(id) {
		return new OrdersController().remove(id);
	}

	// Products in Orders
	static getAllProductsInOrder(orderId) {
		return new ProductsInOrdersController().select('orderId = ?', [orderId]);
	}

	static getProductInOrder(orderId, productId) {
		return new ProductsInOrdersController().select('orderId = ? AND productId = ?', [orderId, productId]);
	}

	static insertProductsInOrder(orderId, products) {
		return Promise.all(products.map((product) => {
			return DataManager.insertProductInOrder(orderId, product.productId, product.amount, product.value);
		}));
	}

	static insertProductInOrder(orderId, productId, amount, value) {
		const productInOrder = { orderId, productId, amount, value };
		return new ProductsInOrdersController().updateById(id, productInOrder);
	}

	static updateProductInOrder(id, amount, value) {
		const productInOrder = { amount, value };
		return new ProductsInOrdersController().updateById(id, productInOrder);
	}

	static removeProductFromOrder(id) {
		return new ProductsInOrdersController().deleteById(id);
	}

	static removeAllProductsFromOrder(orderId) {
		return new ProductsInOrdersController().delete('orderId = ?', [orderId])
	}
}