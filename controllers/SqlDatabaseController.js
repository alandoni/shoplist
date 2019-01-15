import { SQLite } from 'expo';
//SQLite.DEBUG(true);
const db = SQLite.openDatabase('db.db');

const TEXT = 'TEXT';
const INTEGER = 'INTEGER';
const REAL = 'REAL';

const CREATE_TABLE = 'CREATE TABLE IF NOT EXISTS';
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
    static removeLastComma(string) {
        return string.substr(0, string.length - 2);
    }

    static fieldStringBuilder(field) {
        let properties = '';
        if (field.primaryKey) {
            properties += PRIMARY_KEY + ' ';
        }
        if (!field.nullable) {
            properties += NOT_NULL;
        }
        return `${field.name} ${field.type} ${properties}`;
    }

    static foreignKeyStringBuilder(foreignKey) {
        return `${FOREIGNKEY}(${foreignKey.field}) ${REFERENCES} ${foreignKey.tableName}(${foreignKey.foreignField})`;
    }

    static createTableStringBuilder(tableName, fields, foreignKeys) {
        let fieldsBuilder = '';
        for (const field of fields) {
            fieldsBuilder += `${SqlDatabaseController.fieldStringBuilder(field)}, `;
        }
        fieldsBuilder = SqlDatabaseController.removeLastComma(fieldsBuilder);

        let foreignKeysBuilder = '';
        if (foreignKeys) {
            foreignKeysBuilder = ', ';
            for (const foreignKey of foreignKeys) {
                foreignKeysBuilder += `${SqlDatabaseController.foreignKeyStringBuilder(foreignKey)}, `;
            }
            foreignKeysBuilder = SqlDatabaseController.removeLastComma(foreignKeysBuilder);
        }
        return `${CREATE_TABLE} ${tableName} (${fieldsBuilder} ${foreignKeysBuilder});`;
    }

    static createTable(tableName, fields, foreignKeys) {
        db.transaction((tx) => {
            const query = SqlDatabaseController.createTableStringBuilder(tableName, fields, foreignKeys);
            console.log(query);
            tx.executeSql(query, (success) => {
                console.log(success);
            }, (error, errorMessage) => {
                console.log(error);
                console.log(errorMessage);
            });
        });
    }

    static select(tableName, whereCondition, orderBy, groupBy, fields) {
        return db.transaction((tx) => {
            let fieldsString = '';
            if (fields) {
                for (const field of fields) {
                    fieldsStringBuilder += `${field}, `;
                }
                fieldsStringBuilder = SqlDatabaseController.removeLastComma(fieldsStringBuilder);
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
            return new Promise((resolve, reject) => {
                const query = `${SELECT} ${fieldsString} ${FROM} ${tableName} ${whereString} ${orderByString} ${groupByString}`;
                console.log(query);
                tx.executeSql(query, (result) => {
                    resolve(result);
                }, (error) => {
                    reject(error);
                });
            });
        });
    }

    static insert(tableName, fields, values) {
        let fieldsStringBuilder = '';
        let valuesStringBuilder = '';
        for (const field of fields) {
            fieldsStringBuilder += `${field}, `;
            valuesStringBuilder += '?, ';
        }
        fieldsStringBuilder = SqlDatabaseController.removeLastComma(fieldsStringBuilder);
        valuesStringBuilder = SqlDatabaseController.removeLastComma(valuesStringBuilder);
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                const query = `${INSERT} ${tableName} (${fieldsStringBuilder}) ${VALUES} (${valuesStringBuilder})`;
                console.log(query);
                tx.executeSql(query, values, (success) => {
                    resolve(success);
                }, (error) => {
                    console.log('ERROR ');
                    reject(error);
                });
            });
        })
    }

    static update(tableName, dictionary, whereCondition) {
        let fieldsStringBuilder = '';
        for (const field in dictionary) {
            fieldsStringBuilder += `${field} = ?, `;
        }
        fieldsStringBuilder = SqlDatabaseController.removeLastComma(fieldsStringBuilder);
        let whereString = '';
        if (whereCondition) {
            whereString = `${WHERE} (${whereCondition})`;
        }
        return db.transaction((tx) => {
            return tx.executeSql(`${UPDATE} ${tableName} ${SET} (${fieldsStringBuilder}) ${whereString}`, values);
        });
    }

    static remove(tableName, whereCondition) {
        let whereString = '';
        if (whereCondition) {
            whereString = `${WHERE} (${whereCondition})`;
        }
        return db.transaction((tx) => {
            return tx.executeSql(`${DELETE} ${tableName} ${whereString}`);
        });
    }
}

export { SqlDatabaseController, TEXT, INTEGER, REAL, FieldDescriptor, ForeignKeyDescriptor };