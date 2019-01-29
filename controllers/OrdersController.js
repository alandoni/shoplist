import {
  FieldDescriptor,
  TEXT,
  INTEGER,
  REAL,
  ForeignKeyDescriptor,
  SqlDatabaseController,
} from './SqlDatabaseController';
import GenericSqlController from './GenericSqlController';
import ShopListsController from './ShopListsController';

export default class OrdersController extends GenericSqlController {
  getFieldDescriptors = () => [
    new FieldDescriptor('shoplistId', INTEGER),
    new FieldDescriptor('date', TEXT),
    new FieldDescriptor('amountProducts', INTEGER),
    new FieldDescriptor('totalValue', REAL),
  ]

  getForeignKeysDescriptors = () => [
    new ForeignKeyDescriptor('shoplistId', new ShopListsController().getTableName(), 'id'),
  ]

  getTableName = () => 'orders'

  selectAll() {
    return SqlDatabaseController.select(this.getTableName(),
      null, null, this.getForeignKeysDescriptors()[0]).then(this.processData);
  }

  select(condition, params) {
    return SqlDatabaseController.select(this.getTableName(),
      condition, params, this.getForeignKeysDescriptors()[0]);
  }

  selectById(id) {
    return SqlDatabaseController.select(this.getTableName(), 'id = ?', [ id ],
      this.getForeignKeysDescriptors()[0]).then(this.processData);
  }

  selectByName(name) {
    return SqlDatabaseController.select(this.getTableName(), 'name LIKE %?%', [ name ],
      this.getForeignKeysDescriptors()[0]).then(this.processData);
  }
}
