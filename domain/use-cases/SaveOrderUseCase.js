import UseCase from './UseCase';
import UpdateTotalsForOrderUseCase from './UpdateTotalsForOrderUseCase';
import ValidationError from '../ValidationError';

export default class SaveOrderUseCase extends UseCase {
  constructor(ordersRepository, productsInOrderRepository) {
    super();
    this.ordersRepository = ordersRepository;
    this.productsInOrderRepository = productsInOrderRepository;
  }

  async run(order) {
    if (order.name.length < 2) {
      throw new ValidationError('Por favor, digite um nome válido!' );
    }

    new UpdateTotalsForOrderUseCase().getTotals(order);

    let storedOrder;
    if (order.id) {
      await this.productsInOrderRepository.removeByOrderId(order.id);
      storedOrder = await this.ordersRepository.update(order.id, order);
    } else {
      storedOrder = await this.ordersRepository.save(order);
    }

    if (order.products) {
      storedOrder.products = order.products.map(async (product) => {
        const newProduct = (await this.productsInOrderRepository.insert(product))[0];
        newProduct.totalValue = product.amount * product.value;
        return newProduct;
      });
    }
    return storedOrder;
  }
}
