import { FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";
import GenericSqlController from "./GenericSqlController";
import CategoriesController from "./ProductsInShopListsController";

export default class ProductsController extends GenericSqlController {
	constructor() {
		super();
	}

	getFieldDescriptors() {
		return [
			new FieldDescriptor('name', TEXT),
			new FieldDescriptor('notes', TEXT, true),
			new FieldDescriptor('value', REAL),
			new FieldDescriptor('category', INTEGER, false, false),
		];
	}

	getForeignKeysDescriptors() {
		return [
			new ForeignKeyDescriptor('category', new CategoriesController().getTableName(), 'id'),
		];
	}

	getTableName() {
		return 'products';
	}

	processData(data) {
		return data.map((product) => {
			product.value = `R$ ${product.value}`;
			product.id = '' + product.id;
			console.log(product.value);
			return product;
		});
	}

	selectAll() {
		return SqlDatabaseController.select(this.getTableName(), null, null, this.getForeignKeysDescriptors()[0]).then(this.processData);
	}

	select(condition, params) {
		return SqlDatabaseController.select(this.getTableName(), condition, params, this.getForeignKeysDescriptors()[0]);
	}

	selectById(id) {
		return SqlDatabaseController.select(this.getTableName(), `id = ?`, [id], this.getForeignKeysDescriptors()[0]).then(this.processData);
	}

	selectByName(name) {
		return SqlDatabaseController.select(this.getTableName(), `name LIKE %?%`, [name], this.getForeignKeysDescriptors()[0]).then(this.processData);
	}
}