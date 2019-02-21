import UseCase from './UseCase';

export default class AddProductToShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository) {
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
  }

  async run(product) {
    const productInShopList = product;
    productInShopList.amount = 1;
    productInShopList.totalValue = product.amount * product.value;

    
  }
}