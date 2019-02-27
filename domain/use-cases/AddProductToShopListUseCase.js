import UseCase from './UseCase';
import UpdateTotalsForShopListUseCase from './UpdateTotalsForShopListUseCase';

export default class AddProductToShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository, updateTotalsForShopListUseCase) {
    super();
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
    this.updateTotalsForShopListUseCase = updateTotalsForShopListUseCase
  }

  run = async (product) => {
    const productStored = (await this.productsInShopListsRepository.save(product))[0];
    const products = await this.productsInShopListsRepository.getByShopListId(product.shopListId);
    const shopList = await this.shopListsRepository.getById(product.shopListId);
    shopList.products = products;
    this.updateTotalsForShopListUseCase.execute(shopList);
    return productStored;
  }
}
