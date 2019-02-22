import UseCase from './UseCase';
import UpdateTotalsForShopListUseCase from './UpdateTotalsForShopListUseCase';

export default class AddProductToShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
  }

  async run(product) {
    const productStored = (await this.productsInShopListsRepository.save(product))[0];
    const products = await this.productsInShopListsRepository.getByShopListId(product.shopListId);
    const shopList = await this.shopListsRepository.getById(product.shopListId);
    shopList.products = products;
    new UpdateTotalsForShopListUseCase(this.shopListsRepository).execute(shopList);
    return productStored;
  }
}
