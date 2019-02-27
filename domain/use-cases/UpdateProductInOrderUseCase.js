import UseCase from './UseCase';
import UpdateTotalsForOrderUseCase from './UpdateTotalsForOrderUseCase';

export default class UpdateProductInOrderUseCase extends UseCase {
  constructor(ordersRepository, productsInOrderRepository) {
    super();
    this.ordersRepository = ordersRepository;
    this.productsInOrderRepository = productsInOrderRepository;
  }

  run = async (product) => {
    const productStored = (await this.productsInOrderRepository.update(product.id, product))[0];
    const order = await this.ordersRepository.getById(product.orderId);
    const products = await this.productsInOrderRepository.getByOrderId(product.orderId);
    order.products = products;
    await new UpdateTotalsForOrderUseCase(this.ordersRepository).execute(order);
    return productStored;
  }
}
