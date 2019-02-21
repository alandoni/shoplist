import ProductsInShopListsDAO from "../database/ProductsInShopListsDAO";
import ProductsInShopListsRepository from '../../domain/repositories/ProductsInShopListsRepository';

export default class ProductsInShopListsRepositoryImpl extends ProductsInShopListsRepository {
  constructor() {
    super();
    this.dataStore = new ProductsInShopListsDAO();
  }

  async getById(id) {
    return (await this.dataStore.selectById(id))[0];
  }

  async searchByName(name) {
    return await this.dataStore.searchByName(name);
  }

  async save(productInShopList) {
    return (await this.dataStore.insert(productInShopList))[0];
  }

  async update(id, productInShopList) {
    return (await this.dataStore.updateById(id, productInShopList))[0];
  }

  async remove(id) {
    return await this.dataStore.deleteById(id);
  }

  async getByShopListId(id) {
    return await this.dataStore.select('shoplistId = ?', [ id ]);
  }

  async getByShopListIdAndProductId(shopListId, productId) {
    return (await this.dataStore.select('shoplistId = ? AND productId = ?',
      [ shopListId, productId ]))[0];
  }

  async removeByShopListId(shopListId) {
    return await this.dataStore.delete('shopListId = ?', [ shopListId ]);    
  }
}