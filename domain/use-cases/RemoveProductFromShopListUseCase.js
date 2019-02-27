import UpdateTotalsForShopListUseCase from './UpdateTotalsForShopListUseCase';
import UseCase from './UseCase';

export default class RemoveProductFromShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
  }

  run = async (product) => {
    await this.productsInShopListsRepository.remove(product.id);
    const products = await this.productsInShopListsRepository.getByShopListId(product.shopListId);
    const shopList = await this.shopListsRepository.getById(product.shopListId);
    shopList.products = products;
    new UpdateTotalsForShopListUseCase(this.shopListsRepository).execute(shopList);
  }
}
