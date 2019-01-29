import { FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";
import GenericSqlController from "./GenericSqlController";
import ProductsController from "./ProductsController";
import OrdersController from "./OrdersController";

export default class ProductsInOrdersController extends GenericSqlController {
	getFieldDescriptors() {
		return [
			new FieldDescriptor('orderId', INTEGER),
			new FieldDescriptor('productId', INTEGER),
			new FieldDescriptor('value', REAL),
			new FieldDescriptor('amount', REAL),
		];
	}

	getForeignKeysDescriptors() {
		return [
			new ForeignKeyDescriptor('orderId', new OrdersController().getTableName(), 'id'),
			new ForeignKeyDescriptor('productId', new ProductsController().getTableName(), 'id'),
		];
	}

	getTableName() {
		return 'orderProducts';
	}

	processData(data) {
		return data.map((product) => {
			product.id = '' + product.id;
			return product;
		});
	}

	
	selectAll() {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), null, null, 
			this.getForeignKeysDescriptors()[0], null, 
			this.getFieldDescriptors()[1].name).then(this.processData);
	}

	select(condition, params) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), condition, params, 
			this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[1].name).then(this.processData);
	}

	selectById(id) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), `id = ?`, [id], 
			this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[1].name).then(this.processData);
	}

	selectByName(name) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), `name LIKE %?%`, [name], 
			this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[1].name).then(this.processData);
	}
}