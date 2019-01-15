import { SqlDatabaseController, FieldDescriptor, TEXT, INTEGER, REAL, ForeignKeyDescriptor } from "./SqlDatabaseController";
import GenericSqlController from "./GenericSqlController";

export default class CategoriesController extends GenericSqlController {
    getFieldDescriptors() {
        return [
            new FieldDescriptor('name', TEXT),
        ];
    }

    getTableName() {
        return 'categories';
    }

    processData(data) {
        return data.map((value) => {
            value.id = '' + value.id;
            return value;
        });
    }
}