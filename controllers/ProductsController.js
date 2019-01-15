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
}