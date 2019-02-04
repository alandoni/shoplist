import {
  SqlDatabaseHelper,
  FieldDescriptor,
  INTEGER,
  REAL,
  ForeignKeyDescriptor,
} from './SqlDatabaseHelper';
import GenericSqlController from './GenericSqlController';
import ProductsController from './ProductsController';
import ShopListsController from './ShopListsController';

export default class ProductsInShopListsController extends GenericSqlController {
  getFieldDescriptors = () => [
    new FieldDescriptor('shoplistId', INTEGER),
    new FieldDescriptor('productId', INTEGER),
    new FieldDescriptor('value', REAL),
    new FieldDescriptor('amount', REAL),
  ]

  getForeignKeysDescriptors = () => [
    new ForeignKeyDescriptor('shoplistId', new ShopListsController().getTableName(), 'id'),
    new ForeignKeyDescriptor('productId', new ProductsController().getTableName(), 'id'),
  ]

  getTableName = () => 'shoplistProducts'

  selectAll() {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), null, null,
      this.getForeignKeysDescriptors()[1], null, null).then(this.processData);
  }

  select(condition, params) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), condition, params,
      this.getForeignKeysDescriptors()[1], null, null).then(this.processData);
  }

  selectById(id) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), 'id = ?', [ id ],
      this.getForeignKeysDescriptors()[1], null, null).then(this.processData);
  }

  selectByName(name) {
    return SqlDatabaseHelper.select(this.getTableName(), this.fieldNames(), 'name LIKE %?%', [ name ],
      this.getForeignKeysDescriptors()[1], null, null).then(this.processData);
  }
}