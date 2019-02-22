import OrdersDAO from '../database/OrdersDAO';
import OrdersRepository from '../../domain/repositories/OrdersRepository';

export default class OrdersRepositoryImpl extends OrdersRepository {
  constructor() {
    super();
    this.dataStore = new OrdersDAO();
  }

  async getAll() {
    return this.dataStore.selectAll();
  }

  async getById(id) {
    return this.dataStore.selectById(id)[0];
  }

  async searchByName(name) {
    return this.dataStore.searchByName(name);
  }

  async save(order) {
    return this.dataStore.insert(order)[0];
  }

  async update(id, order) {
    return this.dataStore.updateById(id, order)[0];
  }

  async remove(id) {
    return this.dataStore.deleteById(id);
  }
}
