import UseCase from './UseCase';

export default class UpdateTotalsForOrderUseCase extends UseCase {
  constructor(orderRepository) {
    super();
    this.orderRepository = orderRepository;
  }

  run = async (order) => {
    const newOrder = this.getTotals(order);
    const orderStored = await this.orderRepository.update(order.id, newOrder);
    return orderStored;
  }

  getTotals = (order) => {
    const newOrder = order;
    if (order.products.length === 0) {
      newOrder.totalValue = 0;
      newOrder.amountProducts = 0;
    } else {
      const productListInfo = order.products.reduce((accumulator, currentValue) => {
        const acc = {
          amount: (accumulator.amount += currentValue.amount),
          totalValue: (accumulator.totalValue += currentValue.totalValue),
        };
        return acc;
      });
      newOrder.totalValue = productListInfo.totalValue;
      newOrder.amountProducts = productListInfo.amountProducts;
    }
  }
}
