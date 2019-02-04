import {
  SqlDatabaseHelper,
  FieldDescriptor,
  INTEGER,
} from './SqlDatabaseHelper';

export default class GenericSqlController {
  getFieldDescriptors = () => []

  getForeignKeysDescriptors = () => []

  getTableName = () => ''

  processData = data => data.map((value) => {
    const newValue = value;
    newValue.id = `${value.id}`;
    return newValue;
  })

  createTable() {
    const fields = [ new FieldDescriptor('id', INTEGER, true, true), ...this.getFieldDescriptors() ];
    return SqlDatabaseHelper.createTable(this.getTableName(), fields, this.getForeignKeysDescriptors());
  }

  dropTable() {
    return SqlDatabaseHelper.dropTable(this.getTableName());
  }

  insert(data) {
    const fieldNames = this.getFieldDescriptors().map(value => value.name);
    const fieldValues = fieldNames.map(value => data[value]);
    return SqlDatabaseHelper.insert(this.getTableName(), fieldNames, fieldValues).then((id) => {
      const newData = data;
      newData.id = id;
      return this.processData([ newData ]);
    });
  }

  updateById(id, data) {
    const fieldNames = this.getFieldDescriptors().map(value => value.name);
    const fieldValues = fieldNames.map(value => data[value]);
    fieldValues.push(id);
    return SqlDatabaseHelper.update(this.getTableName(), fieldNames,
      'id = ?', fieldValues).then(this.processData);
  }

  update(condition, data, params) {
    const fieldNames = this.getFieldDescriptors().map(value => value.name);
    const fieldValues = fieldNames.map(value => data[value]);
    fieldValues.push(params);
    return SqlDatabaseHelper.update(this.getTableName(), fieldNames,
      condition, fieldValues).then(this.processData);
  }

  deleteById(id) {
    return SqlDatabaseHelper.delete(this.getTableName(), 'id = ?', [ id ]);
  }

  delete(condition, params) {
    return SqlDatabaseHelper.delete(this.getTableName(), condition, params);
  }

  deleteAll() {
    return SqlDatabaseHelper.delete(this.getTableName());
  }

  fieldNames() {
    const fields = this.getFieldDescriptors().reduce((accumulator, current) => `${accumulator}, `
      + `${this.getTableName()}.${current.name}`, `${this.getTableName()}.id`);
    return fields;
  }

  selectAll() {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames()).then(this.processData);
  }

  select(condition, params) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(),
      condition, params);
  }

  selectById(id) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(),
      'id = ?', [ id ]).then(this.processData);
  }

  selectByName(name) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(),
      'name LIKE %?%', [ name ]).then(this.processData);
  }
}
