import { SqlDatabaseController, FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";

export default class GenericSqlController {
	getFieldDescriptors() {
		return [];
	}

	getForeignKeysDescriptors() {
		return [];
	}

	getTableName() {
		return '';
	}

	processData(data) {
		return data;
	}

	createTable() {
		const fields = [new FieldDescriptor('id', INTEGER, true, true), ...this.getFieldDescriptors()];
		return SqlDatabaseController.createTable(this.getTableName(), fields, this.getForeignKeysDescriptors());
	}

	dropTable() {
		return SqlDatabaseController.dropTable(this.getTableName());
	}

	insert(data) {
		const fieldNames = this.getFieldDescriptors().map((value) => {
			return value.name;
		});
		const fieldValues = fieldNames.map((value) => {
			return data[value];
		});
		return SqlDatabaseController.insert(this.getTableName(), fieldNames, fieldValues).then((id) => {
			data.id = id;
			return this.processData([data]);
		});
	}

	updateById(id, data) {
		const fieldNames = this.getFieldDescriptors().map((value) => {
			return value.name;
		});
		const fieldValues = this.fieldNames.map((value) => {
			return data[value];
		});
		fieldValues.push(id);
		return SqlDatabaseController.update(this.getTableName(), fieldNames, `id = ?`, fieldValues).then(this.processData);
	}

	update(condition, data, params) {
		const fieldNames = this.getFieldDescriptors().map((value) => {
			return value.name;
		});
		const fieldValues = this.fieldNames.map((value) => {
			return data[value];
		});
		fieldValues.push(params);
		return SqlDatabaseController.update(this.getTableName(), fieldNames, condition, fieldValues).then(this.processData);
	}

	deleteById(id) {
		return SqlDatabaseController.delete(this.getTableName(), `id = ?`, [id]);
	}

	delete(condition, params) {
		return SqlDatabaseController.delete(this.getTableName(), condition, params);
	}

	deleteAll() {
		return SqlDatabaseController.delete(this.getTableName());
	}

	fieldNames() {
		const fields = this.getFieldDescriptors().reduce((accumulator, current) => {
				return `${accumulator}, ${this.getTableName()}.${current.name}`;
		}, `${this.getTableName()}.id`);
		return fields;
	}

	selectAll() {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames()).then(this.processData);
	}

	select(condition, params) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), condition, params);
	}

	selectById(id) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), `id = ?`, [id]).then(this.processData);
	}

	selectByName(name) {
		return SqlDatabaseController.select(this.getTableName(), this.fieldNames(), `name LIKE %?%`, [name]).then(this.processData);
	}
}