import UseCase from './UseCase';

export default class UpdateTotalsForShopListUseCase extends UseCase {
    constructor(shopListsRepository) {
        super();
        this.shopListsRepository = shopListsRepository;
    }

    async run(shopList) {
        this.getTotals(shopList);
        const shopListStored = await this.shopListsRepository.update(shopList.id, shopList);
        return shopListStored;
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