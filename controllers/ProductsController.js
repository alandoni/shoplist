import { SqlDatabaseController, FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";
import GenericSqlController from "./GenericSqlController";
import CategoriesController from "./CategoriesController";
import { isSupported } from "expo/build/StoreReview/StoreReview";

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
			product.id = '' + product.id;
			return product;
		});
	}

	fieldNames() {
		return `${super.fieldNames()}, ${this.getForeignKeysDescriptors()[0].tableName}.name AS categoryName`;
	}

	selectAll() {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), null, null, 
			this.getForeignKeysDescriptors()[0], null, 
			this.getFieldDescriptors()[3].name).then(this.processData);
	}

	select(condition, params) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), condition, params, 
			this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[3].name).then(this.processData);
	}

	selectById(id) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), `id = ?`, [id], 
			this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[3].name).then(this.processData);
	}

	selectByName(name) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), `name LIKE %?%`, [name], 
			this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[3].name).then(this.processData);
	}
}