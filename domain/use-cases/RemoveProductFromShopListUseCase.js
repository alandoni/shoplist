import UpdateTotalsForShopListUseCase from './UpdateTotalsForShopListUseCase';
import UseCase from './UseCase';

export default class RemoveProductFromShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository, updateTotalsForShopListUseCase) {
    super();
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
    this.updateTotalsForShopListUseCase = updateTotalsForShopListUseCase;
  }

  run = async (product) => {
    await this.productsInShopListsRepository.remove(product.id);
    const products = await this.productsInShopListsRepository.getByShopListId(product.shopListId);
    const shopList = await this.shopListsRepository.getById(product.shopListId);
    shopList.products = products;
    this.updateTotalsForShopListUseCase.execute(shopList);
  }
}
