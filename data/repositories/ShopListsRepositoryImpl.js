import ShopListsDAO from "../database/ShopListsDAO";
import ShopListsRepository from './../../domain/repositories/ShopListsRepository';

export default class ShopListsRepositoryImpl extends ShopListsRepository {
  constructor() {
    super();
    this.dataStore = new ShopListsDAO();
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

  async save(shopList) {
    return (await this.dataStore.insert(shopList))[0];
  }

  async update(id, shopList) {
    return (await this.dataStore.updateById(id, shopList))[0];
  }

  async remove(id) {
    return await this.dataStore.deleteById(id);
  }
}