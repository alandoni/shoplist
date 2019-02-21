import UseCase from './UseCase';
import { throws } from 'assert';

export default class SaveShopListUseCase extends UseCase {
  constructor(shopListsRepository, productsInShopListsRepository) {
    this.shopListsRepository = shopListsRepository;
    this.productsInShopListsRepository = productsInShopListsRepository;
  }

  async run(shopList) {
    if (this.shopList.name.length < 2) {
      throw new ValidationError('Por favor, digite um nome válido!' );
    }

    this.getTotals(shopList);
    
    let storedShopList;
    if (shopList.id) {
      storedShopList = await this.shopListsRepository.save(shopList);
    } else {
      await this.productsInShopListsRepository.removeByShopListId(shopList.id)
      storedShopList = await this.shopListsRepository.update(shopList.id, shopList);
    }
    storedShopList.products = shopList.products.map((product) => {
      const newProduct = (await this.productsInShopListsRepository.insert(product))[0];
      newProduct.totalValue = product.amount * product.value;
      return newProduct;
    });
    return shopList;
  }

  getTotals(shopList) {
    if (shopList.products.length === 0) {
      shopList.totalValue = 0;
      shopList.amountProducts = 0;
    } else {
      const productListInfo = products.reduce((accumulator, currentValue) => {
        const acc = {
          amount: (accumulator.amount += currentValue.amount),
          totalValue: (accumulator.totalValue += currentValue.totalValue),
        };
        return acc;
      });
      shopList.totalValue = productListInfo.totalValue;
      shopList.amountProducts = productListInfo.amountProducts;
    }
  }
}