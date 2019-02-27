import ProductsInOrdersRepository from '../../domain/repositories/ProductsInOrderRepository';

export default class ProductsInOrderRepositoryImpl extends ProductsInOrdersRepository {
  constructor(dataStore) {
    super();
    this.dataStore = dataStore;
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

  async getAllByOrderId(id) {
    return this.dataStore.select('orderId = ?', [ id ]);
  }

  async getByOrderIdAndProductId(orderId, productId) {
    return this.dataStore.select('orderId = ? AND productId = ?',
      [ orderId, productId ])[0];
  }

  async removeAllByOrderId(orderId) {
    return this.dataStore.delete('orderId = ?', [ orderId ]);
  }
}
