import ShopListsDAO from '../database/ShopListsDAO';
import ShopListsRepository from '../../domain/repositories/ShopListsRepository';

export default class ShopListsRepositoryImpl extends ShopListsRepository {
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

  async save(shopList) {
    return this.dataStore.insert(shopList)[0];
  }

  async update(id, shopList) {
    return this.dataStore.updateById(id, shopList)[0];
  }

  async remove(id) {
    return this.dataStore.deleteById(id);
  }
}
