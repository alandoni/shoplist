import { FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";
import GenericSqlController from "./GenericSqlController";
import ProductsController from "./ProductsController";
import ShopListsController from "./ShopListsController";

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
			product.value = `R$ ${product.value}`;
			product.totalValue = `R$ ${product.amount * product.value}`;
			return product;
		});
	}
}