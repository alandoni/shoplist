import { SqlDatabaseController, FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";

class Product {
    id;
    name;
    notes;
    value;
    category;

    constructor(name, notes, value, category) {
        this.name = name;
        this.notes = notes;
        this.value = value;
        this.category = category;
    }
}

class ProductController {
    static tableName = 'products';

    static getFields() {
        return Object.getOwnPropertyNames(Product);
    }

    static createTable() {
        fields = [
            new FieldDescriptor('id', INTEGER, false, true),
            new FieldDescriptor('name', TEXT),
            new FieldDescriptor('notes', TEXT, true),
            new FieldDescriptor('value', REAL),
            new FieldDescriptor('category', INTEGER, false, false),
        ];
        return SqlDatabaseController.createTable(ProductController.tableName, fields);
    }

    static insert(product) {
        return SqlDatabaseController.insert(ProductController.tableName, 
            ProductController.getFields(),
            [product.id, product.name, product.notes, product.value, product.category.id]);
    }

    static selectAll() {
        ProductController.createTable();        
        return SqlDatabaseController.select(ProductController.tableName);
    }

    static selectById(id) {
        return SqlDatabaseController.select(ProductController.tableName, `id = ${id}`);
    }

    static selectByName(name) {
        return SqlDatabaseController.select(ProductController.tableName, `name LIKE %${name}%`);
    }
}

export { Product, ProductController };