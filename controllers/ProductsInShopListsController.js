import { SqlDatabaseController, FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";
import GenericSqlController from "./GenericSqlController";
import ProductsController from "./ProductsController";
import ShopListsController from "./ShopListsController";

export default class ProductsInShopListsController extends GenericSqlController {
	getFieldDescriptors() {
		return [
			new FieldDescriptor('shoplistId', INTEGER),
			new FieldDescriptor('productId', INTEGER),
			new FieldDescriptor('value', REAL),
			new FieldDescriptor('amount', REAL),
		];
	}

	getForeignKeysDescriptors() {
		return [
			new ForeignKeyDescriptor('shoplistId', new ShopListsController().getTableName(), 'id'),
			new ForeignKeyDescriptor('productId', new ProductsController().getTableName(), 'id'),
		];
	}

	getTableName() {
		return 'shoplistProducts';
	}

	processData(data) {
		return data.map((product) => {
			product.id = '' + product.id;
			return product;
		});
	}
	
	selectAll() {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), null, null, 
			this.getForeignKeysDescriptors()[1], null, null).then(this.processData);
	}

	select(condition, params) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), condition, params, 
			this.getForeignKeysDescriptors()[1], null, null).then(this.processData);
	}

	selectById(id) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), `id = ?`, [id], 
			this.getForeignKeysDescriptors()[1], null, null).then(this.processData);
	}

	selectByName(name) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), `name LIKE %?%`, [name], 
			this.getForeignKeysDescriptors()[1], null, null).then(this.processData);
	}
}