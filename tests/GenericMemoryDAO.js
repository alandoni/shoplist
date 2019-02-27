import * as setElement from '../presentation/utils/utils';

export default class GenericMemoryDAO {

  constructor() {
    this.lastId = 1;
    this.list = [];
  }

  insert(data) {
    data.id = this.lastId;
    this.list.push(data);
    this.lastId++;
    return data;
  }

  updateById(id, data) {
    this.list.setElement(data, (element) => element.id === id);
    return data;
  }

  deleteById(id) {
    this.list = this.list.filter((element) => element.id !== id);
  }

  deleteAll() {
    this.list = [];
  }

  selectAll() {
    return this.list;
  }

  selectById(id) {
    return this.list.filter((element) => element.id === id);
  }

  selectByName(name) {
    return this.list.filter((element) => element.name.indexOf(name) > -1);
  }
}
