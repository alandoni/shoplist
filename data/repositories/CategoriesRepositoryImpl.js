import CategoriesRepository from '../../domain/repositories/CategoriesRepository';

export default class CategoriesRepositoryImpl extends CategoriesRepository {
  constructor(dataStore) {
    super();
    this.dataStore = dataStore;
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

  async save(category) {
    return this.dataStore.insert(category)[0];
  }

  async update(id, category) {
    return this.dataStore.updateById(id, category)[0];
  }

  async remove(id) {
    return this.dataStore.deleteById(id);
  }
}
