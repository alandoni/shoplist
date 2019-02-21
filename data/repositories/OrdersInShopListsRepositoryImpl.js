import ProductsInOrdersDAO from "../database/ProductsInOrdersDAO";
import ProductsInOrdersRepository from '../../domain/repositories/ProductsInOrdersRepository';

export default class ProductsInOrdersRepositoryImpl extends ProductsInOrdersRepository {
  constructor() {
    super();
    this.dataStore = new ProductsInOrdersDAO();
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

  async getAllByOrderId(id) {
    return await this.dataStore.select('orderId = ?', [ id ]);
  }

  async getByOrderIdAndProductId(orderId, productId) {
    return (await this.dataStore.select('orderId = ? AND productId = ?',
      [ orderId, productId ]))[0];
  }

  async removeAllByOrderId(orderId) {
    return await this.dataStore.delete('orderId = ?', [ orderId ]);    
  }
}