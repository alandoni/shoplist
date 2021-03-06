import UseCase from './UseCase';
import UpdateTotalsForOrderUseCase from './UpdateTotalsForOrderUseCase';

export default class AddProductToOrderUseCase extends UseCase {
  constructor(orderRepository, productsInOrderRepository, updateTotalsForOrderUseCase) {
    super();
    this.orderRepository = orderRepository;
    this.productsInOrderRepository = productsInOrderRepository;
    this.updateTotalsForOrderUseCase = updateTotalsForOrderUseCase;
  }

  run = async (product) => {
    const productStored = (await this.productsInOrderRepository.save(product))[0];
    const products = await this.productsInOrderRepository.getByOrderId(product.orderId);
    const order = await this.orderRepository.getById(product.orderId);
    order.products = products;
    this.updateTotalsForOrderUseCase.execute(order);
    return productStored;
  }
}
