import {
  FieldDescriptor,
  TEXT,
} from './SqlDatabaseHelper';
import GenericSqlDAO from './GenericSqlDAO';

export default class CategoriesDAO extends GenericSqlDAO {
  getFieldDescriptors = () => [
    new FieldDescriptor('name', TEXT),
  ]

  getTableName = () => 'categories'
}
