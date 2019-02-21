import UseCase from './UseCase';

export default class AddProductToShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
  }

  async run(product) {
    const productStored = (await this.productsInShopListsRepository.update(product.id, product))[0];
    const shopList = await this.shopListsRepository.getById(product.shopListId);
    const products = await this.productsInShopListsRepository.getByShopListId(product.shopListId);
    shopList.products = products;
    await new UpdateTotalsForShopListUseCase(this.shopListsRepository).execute(shopList);
    return productStored;
  }
}