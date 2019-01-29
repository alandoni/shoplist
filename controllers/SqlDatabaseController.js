import { SQLite } from 'expo';
//SQLite.DEBUG(true);
const db = SQLite.openDatabase('db.db');

const TEXT = 'TEXT';
const INTEGER = 'INTEGER';
const REAL = 'REAL';

const CREATE_TABLE = 'CREATE TABLE IF NOT EXISTS';
const DROP_TABLE = 'DROP TABLE';
const PRIMARY_KEY = 'PRIMARY KEY';
const NOT_NULL = 'NOT NULL';
const FOREIGNKEY = 'FOREIGN KEY';
const REFERENCES = 'REFERENCES';

const INSERT = 'INSERT INTO';
const VALUES = 'VALUES';

const UPDATE = 'UPDATE';
const SET = 'SET';
const WHERE = 'WHERE';

const SELECT = 'SELECT';
const WILD_CARD = '*';
const FROM = 'FROM';
const GROUP_BY = 'GROUP BY';
const ORDER_BY = 'ORDER BY';
const DELETE = 'DELETE FROM';
const INNER_JOIN = 'INNER JOIN';
const ON = 'ON';

class FieldDescriptor {
	type;
	name;
	nullable;
	primaryKey;

	constructor(name, type, nullable, primaryKey) {
		this.name = name;
		this.type = type;
		this.nullable = nullable;
		this.primaryKey = primaryKey;
	}
}

class ForeignKeyDescriptor {
	field;
	tableName;
	foreignField;

	constructor(field, foreignTableName, foreignField) {
		this.field = field;
		this.tableName = foreignTableName;
		this.foreignField = foreignField;
	}
}

class SqlDatabaseController {
	static fieldStringBuilder(field) {
		let properties = '';
		if (field.primaryKey) {
			properties += ` ${PRIMARY_KEY}`;
		}
		if (!field.nullable) {
			properties += ` ${NOT_NULL}`;
		}
		return `${field.name} ${field.type}${properties}`;
	}

	static foreignKeyStringBuilder(foreignKey) {
		return `${FOREIGNKEY}(${foreignKey.field}) ${REFERENCES} ${foreignKey.tableName}(${foreignKey.foreignField})`;
	}

	static createTableStringBuilder(tableName, fields, foreignKeys) {
		let fieldsBuilder = fields.reduce((accumulator, currentValue) => {
			if (!accumulator.length) {
				return `${SqlDatabaseController.fieldStringBuilder(currentValue)}`;
			}
			return `${accumulator}, ${SqlDatabaseController.fieldStringBuilder(currentValue)}`;
		}, '');

		let foreignKeysBuilder = '';
		if (foreignKeys.length) {
			foreignKeysBuilder = foreignKeys.reduce((accumulator, currentValue) => {
				return `${accumulator}, ${SqlDatabaseController.foreignKeyStringBuilder(currentValue)}`
			}, '');
		}
		return `${CREATE_TABLE} ${tableName} (${fieldsBuilder}${foreignKeysBuilder});`;
	}

	static createTable(tableName, fields, foreignKeys) {
		const query = SqlDatabaseController.createTableStringBuilder(tableName, fields, foreignKeys);
		console.log(query);

		return SqlDatabaseController.createTransaction(query);
	}

	static dropTable(tableName) {
		const query = `${DROP_TABLE} ${tableName}`;
		console.log(query);
		return SqlDatabaseController.createTransaction(query);
	}

	static createTransaction(query, params) {
		console.log(query);

		if (params) {
			console.log(params);
		}

		let result = null;
		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(query, params, (transaction, resultSet) => {
					if (resultSet.insertId) {
						result = resultSet.insertId;
					}
					if (resultSet.rows._array) {
						result = resultSet.rows._array;
					}
				});
			}, (error) => {
				console.error(error);
				reject(error);
			}, () => {
				resolve(result);
			});
		});
	}

	static select(tableName, fields, whereCondition, params, innerJoin, orderBy, groupBy) {
		let fieldsString = '';
		if (fields) {
			fieldsString = fields;
		} else {
			fieldsString = WILD_CARD;
		}
		let orderByString = '';
		if (orderBy) {
			orderByString = `${ORDER_BY} ${orderBy}`;
		}
		let groupByString = '';
		if (groupBy) {
			groupByString = `${GROUP_BY} ${groupBy}`;
		}
		let whereString = '';
		if (whereCondition) {
			whereString = `${WHERE} (${whereCondition})`;
		}
		let innerJoinString = '';
		if (innerJoin) {
			innerJoinString = `${INNER_JOIN} ${innerJoin.tableName} ${ON} ${tableName}.${innerJoin.field} = ${innerJoin.tableName}.${innerJoin.foreignField}`;
		}
		const query = `${SELECT} ${fieldsString} ${FROM} ${tableName} ${innerJoinString} ${whereString} ${orderByString} ${groupByString}`;
		console.log(query);

		return SqlDatabaseController.createTransaction(query, params);
	}

	static insert(tableName, fields, params) {
		const fieldsStringBuilder = fields.reduce((accumulator, currentValue) => {
			if (!accumulator.length) {
				return `${currentValue}`;
			}
			return `${accumulator}, ${currentValue}`;
		}, '');

		const valuesStringBuilder = fields.reduce((accumulator, currentValue) => {
			if (!accumulator.length) {
				return '?';
			}
			return `${accumulator}, ?`;
		}, '');

		return SqlDatabaseController.createTransaction(query, params);
	}

	static update(tableName, fields, whereCondition, params) {
		const fieldsStringBuilder = fields.reduce((accumulator, currentValue) => {
			if (!accumulator.length) {
				return `${currentValue} = ?`;
			}
			return `${accumulator}, ${currentValue} = ?`;
		}, '');

		let whereString = '';
		if (whereCondition) {
			whereString = `${WHERE} (${whereCondition})`;
		}
		const query = `${UPDATE} ${tableName} ${SET} ${fieldsStringBuilder} ${whereString}`;

		return SqlDatabaseController.createTransaction(query, params)
	}

	static delete(tableName, whereCondition, params) {
		let whereString = '';
		if (whereCondition) {
			whereString = `${WHERE} (${whereCondition})`;
		}
		const query = `${DELETE} ${tableName} ${whereString}`;

		return SqlDatabaseController.createTransaction(query, params);
	}
}

export { SqlDatabaseController, TEXT, INTEGER, REAL, FieldDescriptor, ForeignKeyDescriptor };