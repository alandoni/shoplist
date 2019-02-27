import UseCase from './UseCase';
import UpdateTotalsForShopListUseCase from './UpdateTotalsForShopListUseCase';
import ValidationError from '../ValidationError';

export default class SaveShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository, updateTotalsForShopListUseCase) {
    super();
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
    this.updateTotalsForShopListUseCase = updateTotalsForShopListUseCase;
  }

  run = async (shopList) => {
    if (shopList.name.length < 2) {
      throw new ValidationError('Por favor, digite um nome válido!' );
    }

    this.updateTotalsForShopListUseCase.getTotals(shopList);

    let storedShopList;
    if (shopList.id) {
      await this.productsInShopListsRepository.removeByShopListId(shopList.id);
      storedShopList = await this.shopListsRepository.update(shopList.id, shopList);
    } else {
      storedShopList = await this.shopListsRepository.save(shopList);
    }

    if (shopList.products) {
      storedShopList.products = shopList.products.map(async (product) => {
        const newProduct = (await this.productsInShopListsRepository.insert(product))[0];
        newProduct.totalValue = product.amount * product.value;
        return newProduct;
      });
    }
    return storedShopList;
  }
}
