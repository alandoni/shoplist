import {
  FieldDescriptor,
  TEXT,
} from './SqlDatabaseController';
import GenericSqlController from './GenericSqlController';

export default class CategoriesController extends GenericSqlController {
  getFieldDescriptors = () => [
    new FieldDescriptor('name', TEXT),
  ]

  getTableName = () => 'categories'
}
