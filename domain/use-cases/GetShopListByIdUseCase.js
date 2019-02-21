import UseCase from './UseCase';

export default class GetShopListsUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
  }

  async run(id) {
    const shopList = await this.shopListsRepository.getShopListById(id);
    const products = await this.productsInShopListsRepository.getPByShopListId(id);
    shopList.products = products.map((product) => {
      const newProduct = product;
      newProduct.totalValue = product.amount * product.value;
      return newProduct;
    });
    return shopList;
  }
}