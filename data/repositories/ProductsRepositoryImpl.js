import ProductsDAO from "../database/ProductsDAO";
import ProductsRepository from '../../domain/repositories/ProductsRepository';

export default class ProductsRepositoryImpl extends ProductsRepository {
  constructor() {
    super();
    this.dataStore = new ProductsDAO();
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

  async save(product) {
    return (await this.dataStore.insert(product))[0];
  }

  async update(id, product) {
    return (await this.dataStore.updateById(id, product))[0];
  }

  async remove(id) {
    return await this.dataStore.deleteById(id);
  }
}