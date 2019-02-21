import OrdersDAO from "../database/OrdersDAO";
import OrdersRepository from '../../domain/repositories/OrdersRepository';

export default class OrdersRepositoryImpl extends OrdersRepository {
  constructor() {
    this.dataStore = new OrdersDAO();
  }

  async getAll() {
    return await this.dataStore.selectAll();
  }

  async getById(id) {
    return (await this.dataStore.selectById(id))[0];
  }

  async searchByName(name) {
    return await this.dataStore.searchByName(name);
  }

  async save(order) {
    return (await this.dataStore.insert(order))[0];
  }

  async update(id, order) {
    return (await this.dataStore.updateById(id, order))[0];
  }

  async remove(id) {
    return await this.dataStore.deleteById(id);
  }
}