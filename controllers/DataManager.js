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

function log(text) {
	console.log(text);
}

class ListManipulator {
	static getAll(list) {
		return Promise.resolve(list);
	}

	static getById(list, id) {
		return Promise.resolve(list.filter((value) => value.id === id)[0]);
	}

	static searchByName(list, name) {
		return Promise.resolve(list.filter((value) => value.name.indexOf(name) >= 0));
	}

	static save(list, item) {
		item.id = (list.length + 1) + ''
		list.push(item);
		return Promise.resolve(item);
	}

	static update(list, id, item) {
		for (let index = 0; index < list.length; index++) {
			if (list[index].id === id) {
				list[index] = item;
			}
		}
		return Promise.resolve(item);
	}

	static remove(list, id) {
		let item = null;
		for (let index = 0; index < list.length; index++) {
			if (list[index].id === id) {
				item = list.splice(index, 1);
			}
		}
		return Promise.resolve(item);
	}
}

class SQLManipulator {
	createTables() {
		db.transaction((tx) => {
			tx.executeSql(`create table if not exists categories 
                (id integer primary key not null, 
                name text)`);
			tx.executeSql(`create table if not exists products 
                (id integer primary key not null, 
                name text,
                notes text,
                value real, 
                category integer, 
                FOREIGN KEY(category) REFERENCES categories(id))`);
			tx.executeSql(`create table if not exists category 
                (id integer primary key not null, 
                name text)`);
			tx.executeSql(`create table if not exists shopLists 
                (id integer primary key not null, 
                name text,
                totalValue real)`);
			tx.executeSql(`create table if not exists shopLists 
                (id integer primary key not null, 
                shopList integer,
                product integer,
                value real,
                amount real,
                totalValue real,
                FOREIGN KEY(shopList) REFERENCES shopLists(id)
                FOREIGN KEY(product) REFERENCES products(id)))`);
			tx.executeSql(`create table if not exists orders 
                (id integer primary key not null, 
                shopList integer,
                date text,
                totalValue real,
                FOREIGN KEY(shopList) REFERENCES shopLists(id))`);
			tx.executeSql(`create table if not exists orderProducts
                (id integer primary key not null, 
                order integer,
                product integer,
                value real,
                amount real,
                totalValue real,
                FOREIGN KEY(order) REFERENCES orders(id)
                FOREIGN KEY(product) REFERENCES products(id))`);


			tx.executeSql('insert into items (done, value) values (0, ?)', [text]);
			tx.executeSql('select * from items', [], (_, { rows }) =>
				console.log(JSON.stringify(rows))
			);
		});
	}
}

export default class DataManager {

	// Products
	static getAllProducts() {
		return new ProductsController().selectAll();
	}

	static getProductById(id) {
		return new ProductsController().getById(products, id)
	}

	static searchProductByName(name) {
		return new ProductsController().selectByName(products, name);
	}

	static saveProduct(name, value, notes, category) {
		const product = { name, notes, value, category };
		return new ProductsController().insert(product);
	}

	static updateProduct(id, name, value, notes, category) {
		const product = { name, value, notes, category: category };
		return new ProductsController().updateById(products, id, product)
	}

	static removeProduct(id) {
		return new ProductsController().delete(id);
	}

	static removeAllProducts() {
		return new ProductsController().deleteAll();
	}

	// Categories
	static getAllCategories() {
		return new CategoriesController().getAll();
	}

	static getCategoryById(id) {
		return new CategoriesController().getById(id)
	}

	static searchCategoryByName(name) {
		return new CategoriesController().searchByName(name);
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
		return new ShopListsController().getAll();
	}

	static getShopListById(id) {
		return new ShopListsController().getById(id)
	}

	static searchShopListByName(name) {
		return new ShopListsController().searchByName(name);
	}

	static _createShopListObject(name, products) {
		const productListInfo = products.reduce((accumulator, currentValue) => {
			return {
				amount: (accumulator.amount += currentValue.amount),
				totalValue: (accumulator.totalValue += currentValue.totalValue)
			};
		});
		return { name, totalValue: productListInfo.totalValue, amountProducts: productListInfo.amount };
	}

	static saveShopList(name, products) {
		return new ShopListsController().save(DataManager._createShopListObject(name, products)).then((shopList) => {
			return insertProductsInShopList(shopList.id, products);
		});
	}

	static updateShopList(id, name, products) {
		return new ShopListsController().update(id, DataManager._createShopListObject(name, products)).then(() => {
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
			return DataManager.insertProductInShopList(shopListId, product.productId, product.amount, product.value);
		}));
	}

	static insertProductInShopList(shoplistId, productId, amount, value) {
		const productInShopList = { shoplistId, productId, amount, value };
		return new ProductsInShopListsController().updateById(id, productInShopList);
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
		return new OrdersController().getAll();
	}

	static getOrderById(id) {
		return new OrdersController().getById(id)
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
		return new OrdersController().save(DataManager._createOrderObject(shoplistId, date, products)).then((order) => {
			return insertProductsInOrder(order.id, products);
		});
	}

	static updateOrder(id, shoplistId, date, products) {
		return new OrdersController().update(id, DataManager._createOrderObject(shoplistId, date, products)).then(() => {
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