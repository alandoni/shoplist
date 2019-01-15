import { ProductController, Product } from "./ProductController";

products = [{
    name: 'Roupa', value: 'R$ 3,50', id: '1', amount: '2' , totalValue: 'R$ 7,00'

},
{
    name: 'Sapato', value: 'R$ 4,00', id: '2', amount: '1', totalValue: 'R$ 4,00'
},];
categories = [];
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

    // ShopLists
    static getAllShopLists() {
        return ListManipulator.getAll(shopLists);
    }

    static getShopListById(id) {
        return ListManipulator.getById(shopLists, id)
    }

    static searchShopListByName(name) {
        return ListManipulator.searchByName(list, name);
    }

    static saveShopList(shopListName, products) {
        const shopList = { name: shopListName, products };
        return ListManipulator.save(shopLists, shopList);
    }

    static updateShopList(id, name, products) {
        const shopList = { name: name, products };
        return ListManipulator.update(shopLists, id, shopList)
    }

    static removeShopList(id) {
        return ListManipulator.remove(shopLists, id);
    }

    // Products

    static getAllProducts() {
        return ProductController.selectAll();
    }

    static getProductById(id) {
        return ProductController.getById(products, id)
    }

    static searchProductByName(name) {
        return ProductController.selectByName(products, name);
    }

    static saveProduct(name, value, notes, category) {
        const product = new Product(name, notes, value, category);
        return ProductController.insert(product);
    }

    static updateProduct(id, name, value, notes, categoryId) {
        const product = { name, value, notes, category: categoryId };
        return ListManipulator.update(products, id, product)
    }

    static removeProduct(id) {
        return ListManipulator.remove(products, id);
    }

    // Categories

    static getAllCategories() {
        return ListManipulator.getAll(categories);
    }

    static getCategoryById(id) {
        return ListManipulator.getById(categories, id)
    }

    static searchCategoryByName(name) {
        return ListManipulator.searchByName(categories, name);
    }

    static saveCategory(name) {
        const category = { name };
        return ListManipulator.save(categories, category);
    }

    static updateCategory(id, name) {
        const category = { name };
        return ListManipulator.update(categories, id, category)
    }

    static removeCategory(id) {
        return ListManipulator.remove(categories, id);
    }

    // Products in Shop Lists

    static getAllProductsInShopList(shopListId) {
        
    }

    static getProductInShopList(shopListId, productId) {

    }

    static searchProductInShopList(shopListId, productName) {

    }

    static saveProductInShopList(shopListId, productId, value, amount) {

    }

    static removeProductFromShopList(shopListId, productId) {

    }
    
    static removeAllProductsFromShopList(shopListId) {

    }
}