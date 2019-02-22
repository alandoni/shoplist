import ProductsDAO from '../database/ProductsDAO';
import ProductsRepository from '../../domain/repositories/ProductsRepository';

export default class ProductsRepositoryImpl extends ProductsRepository {
  constructor() {
    super();
    this.dataStore = new ProductsDAO();
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

  async save(product) {
    return this.dataStore.insert(product)[0];
  }

  async update(id, product) {
    return this.dataStore.updateById(id, product)[0];
  }

  async remove(id) {
    return this.dataStore.deleteById(id);
  }
}
