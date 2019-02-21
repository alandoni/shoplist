import CategoriesDAO from "../database/CategoriesDAO";
import CategoriesRepository from '../../domain/repositories/CategoriesRepository';

export default class CategoriesRepositoryImpl extends CategoriesRepository {
  constructor() {
    super();
    this.dataStore = new CategoriesDAO();
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

  async save(category) {
    return (await this.dataStore.insert(category))[0];
  }

  async update(id, category) {
    return (await this.dataStore.updateById(id, category))[0];
  }

  async remove(id) {
    return await this.dataStore.deleteById(id);
  }
}