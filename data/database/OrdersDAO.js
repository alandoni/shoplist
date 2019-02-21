import {
  FieldDescriptor,
  TEXT,
  INTEGER,
  REAL,
  ForeignKeyDescriptor,
  SqlDatabaseHelper,
} from './SqlDatabaseHelper';
import GenericSqlDAO from './GenericSqlDAO';
import ShopListsDAO from './ShopListsDAO';

export default class OrdersDAO extends GenericSqlDAO {
  getFieldDescriptors = () => [
    new FieldDescriptor('shoplistId', INTEGER),
    new FieldDescriptor('date', TEXT),
    new FieldDescriptor('amountProducts', INTEGER),
    new FieldDescriptor('totalValue', REAL),
  ]

  getForeignKeysDescriptors = () => [
    new ForeignKeyDescriptor('shoplistId', new ShopListsDAO().getTableName(), 'id'),
  ]

  getTableName = () => 'orders'

  fieldNames() {
    return `${super.fieldNames()}, ${this.getForeignKeysDescriptors()[0].tableName}.name AS shopListName`;
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
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), `${this.getTableName()}.id = ?`, [ id ],
      this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[3].name).then(this.processData);
  }

  selectByName(name) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), `${this.getTableName()}.name LIKE %?%`, [ name ],
      this.getForeignKeysDescriptors()[0], null, this.getFieldDescriptors()[3].name).then(this.processData);
  }
}
