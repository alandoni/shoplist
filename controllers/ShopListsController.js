import {
  FieldDescriptor,
  TEXT,
  INTEGER,
  REAL,
} from './SqlDatabaseController';
import GenericSqlController from './GenericSqlController';

export default class ShopListsController extends GenericSqlController {
  getFieldDescriptors = () => [
    new FieldDescriptor('name', TEXT),
    new FieldDescriptor('amountProducts', INTEGER),
    new FieldDescriptor('totalValue', REAL),
  ]

  getTableName = () => 'shoplists'
}
