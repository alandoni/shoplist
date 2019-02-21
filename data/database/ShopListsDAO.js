import {
  FieldDescriptor,
  TEXT,
  INTEGER,
  REAL,
} from './SqlDatabaseHelper';
import GenericSqlDAO from './GenericSqlDAO';

export default class ShopListsDAO extends GenericSqlDAO {
  getFieldDescriptors = () => [
    new FieldDescriptor('name', TEXT),
    new FieldDescriptor('amountProducts', INTEGER),
    new FieldDescriptor('totalValue', REAL),
  ]

  getTableName = () => 'shoplists'
}
