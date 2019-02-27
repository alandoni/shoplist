import ProductsInShopListsRepository from '../../domain/repositories/ProductsInShopListsRepository';

export default class ProductsInShopListsRepositoryImpl extends ProductsInShopListsRepository {
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

  async save(productInShopList) {
    return this.dataStore.insert(productInShopList)[0];
  }

  async update(id, productInShopList) {
    return this.dataStore.updateById(id, productInShopList)[0];
  }

  async remove(id) {
    return this.dataStore.deleteById(id);
  }

  async getByShopListId(id) {
    return this.dataStore.select('shoplistId = ?', [ id ]);
  }

  async getByShopListIdAndProductId(shopListId, productId) {
    return this.dataStore.select('shoplistId = ? AND productId = ?',
      [ shopListId, productId ])[0];
  }

  async removeByShopListId(shopListId) {
    return this.dataStore.delete('shopListId = ?', [ shopListId ]);
  }
}
