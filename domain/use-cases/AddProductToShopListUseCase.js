import UseCase from './UseCase';
import SaveShopListUseCase from './SaveShopListUseCase';

export default class AddProductToShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository) {
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
  }

  async run(product) {
    const productStored = (await this.productsInShopListsRepository.save(product))[0];
    const shopList = await this.shopListsRepository.getById(product.shopListId);
    const products = await this.productsInShopListsRepository.getByShopListId(product.shopListId);
    shopList.products = products;
    new SaveShopListUseCase().getTotals(shopList);
    await this.shopListsRepository.save(shopList);
    return productStored;
  }
}