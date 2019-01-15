import { FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";
import GenericSqlController from "./GenericSqlController";

export default class ShopListsController extends GenericSqlController {
	getFieldDescriptors() {
		return [
			new FieldDescriptor('name', TEXT),
			new FieldDescriptor('amountProducts', INTEGER),
			new FieldDescriptor('totalValue', REAL),
		];
	}

	getTableName() {
		return 'shoplists';
	}

	processData(data) {
		return data.map((value) => {
			value.id = '' + value.id;
			product.value = `R$ ${value.totalValue}`;
			return value;
		});
	}
}