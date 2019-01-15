import { FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";
import GenericSqlController from "./GenericSqlController";
import ShopListsController from "./ShopListsController";

export default class OrdersController extends GenericSqlController {
	getFieldDescriptors() {
		return [
			new FieldDescriptor('shoplistId', INTEGER),
			new FieldDescriptor('date', TEXT),
			new FieldDescriptor('amountProducts', INTEGER),
			new FieldDescriptor('totalValue', REAL),
		];
	}

	getForeignKeysDescriptors() {
		return [
			new ForeignKeyDescriptor('shoplistId', new ShopListsController().getTableName(), 'id'),
		]
	}

	getTableName() {
		return 'orders';
	}

	processData(data) {
		return data.map((value) => {
			value.id = '' + value.id;
			product.value = `R$ ${value.totalValue}`;
			return value;
		});
	}
}