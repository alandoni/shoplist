import {
  SqlDatabaseHelper,
  FieldDescriptor,
  TEXT,
  INTEGER,
  REAL,
  ForeignKeyDescriptor,
} from './SqlDatabaseHelper';
import GenericSqlController from './GenericSqlController';
import CategoriesController from './CategoriesController';

export default class ProductsController extends GenericSqlController {
  getFieldDescriptors = () => [
    new FieldDescriptor('name', TEXT),
    new FieldDescriptor('notes', TEXT, true),
    new FieldDescriptor('value', REAL),
    new FieldDescriptor('category', INTEGER, false, false),
  ]

  getForeignKeysDescriptors = () => [
    new ForeignKeyDescriptor('category', new CategoriesController().getTableName(), 'id'),
  ]

  getTableName = () => 'products'

  fieldNames() {
    return `${super.fieldNames()}, ${this.getForeignKeysDescriptors()[0].tableName}.name AS categoryName`;
  }

  selectAll() {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), null, null,
      this.getForeignKeysDescriptors()[0], null,
      this.getFieldDescriptors()[3].name).then(this.processData);
  }

  select(condition, params) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), condition, params,
      this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[3].name).then(this.processData);
  }

  selectById(id) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), 'id = ?', [ id ],
      this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[3].name).then(this.processData);
  }

  selectByName(name) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), 'name LIKE %?%', [ name ],
      this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[3].name).then(this.processData);
  }
}
