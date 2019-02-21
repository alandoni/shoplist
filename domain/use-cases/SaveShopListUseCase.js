import UseCase from './UseCase';
import UpdateTotalsForShopListUseCase from './UpdateTotalsForShopListUseCase';
import ValidationError from '../ValidationError';

export default class SaveShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
  }

  async run(shopList) {
    if (shopList.name.length < 2) {
      throw new ValidationError('Por favor, digite um nome válido!' );
    }

    new UpdateTotalsForShopListUseCase().getTotals(shopList);
    
    let storedShopList;
    if (shopList.id) {
      storedShopList = await this.shopListsRepository.save(shopList);
    } else {
      await this.productsInShopListsRepository.removeByShopListId(shopList.id)
      storedShopList = await this.shopListsRepository.update(shopList.id, shopList);
    }

    if (products) {
      storedShopList.products = shopList.products.map(async (product) => {
        const newProduct = (await this.productsInShopListsRepository.insert(product))[0];
        newProduct.totalValue = product.amount * product.value;
        return newProduct;
      });
    }
    return storedShopList;
  }
}
