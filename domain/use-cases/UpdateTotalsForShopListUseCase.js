import UseCase from './UseCase';

export default class UpdateTotalsForShopListUseCase extends UseCase {
  constructor(shopListsRepository) {
    super();
    this.shopListsRepository = shopListsRepository;
  }

  run = async (shopList) => {
    const newShopList = this.getTotals(shopList);
    const shopListStored = await this.shopListsRepository.update(newShopList.id, newShopList);
    return shopListStored;
  }

  getTotals = (shopList) => {
    const newShopList = shopList;
    if (shopList.products.length === 0) {
      newShopList.totalValue = 0;
      newShopList.amountProducts = 0;
    } else {
      const productListInfo = shopList.products.reduce((accumulator, currentValue) => {
        const acc = {
          amount: (accumulator.amount += currentValue.amount),
          totalValue: (accumulator.totalValue += currentValue.totalValue),
        };
        return acc;
      });
      newShopList.totalValue = productListInfo.totalValue;
      newShopList.amountProducts = productListInfo.amountProducts;
    }
    return newShopList;
  }
}
