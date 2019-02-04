import {
  FieldDescriptor,
  INTEGER,
  REAL,
  ForeignKeyDescriptor,
  SqlDatabaseHelper,
} from './SqlDatabaseHelper';
import GenericSqlController from './GenericSqlController';
import ProductsController from './ProductsController';
import OrdersController from './OrdersController';

export default class ProductsInOrdersController extends GenericSqlController {
  getFieldDescriptors = () => [
    new FieldDescriptor('orderId', INTEGER),
    new FieldDescriptor('productId', INTEGER),
    new FieldDescriptor('value', REAL),
    new FieldDescriptor('amount', REAL),
  ]

  getForeignKeysDescriptors = () => [
    new ForeignKeyDescriptor('orderId', new OrdersController().getTableName(), 'id'),
    new ForeignKeyDescriptor('productId', new ProductsController().getTableName(), 'id'),
  ]

  getTableName = () => 'orderProducts'

  selectAll() {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), null, null,
      this.getForeignKeysDescriptors()[0], null,
      this.getFieldDescriptors()[1].name).then(this.processData);
  }

  select(condition, params) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), condition, params,
      this.getForeignKeysDescriptors()[0], null,
      this.getFieldDescriptors()[1].name).then(this.processData);
  }

  selectById(id) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), 'id = ?', [ id ],
      this.getForeignKeysDescriptors()[0], null,
      this.getFieldDescriptors()[1].name).then(this.processData);
  }

  selectByName(name) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(),
      'name LIKE %?%', [ name ], this.getForeignKeysDescriptors()[0], null,
      this.getFieldDescriptors()[1].name).then(this.processData);
  }
}