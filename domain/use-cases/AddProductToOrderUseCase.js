import UseCase from './UseCase';
import UpdateTotalsForOrderUseCase from './UpdateTotalsForOrderUseCase';

export default class AddProductToOrderUseCase extends UseCase {
  constructor(orderRepository, productsInOrderRepository) {
    super();
    this.orderRepository = orderRepository;
    this.productsInOrderRepository = productsInOrderRepository;
  }

  async run(product) {
    const productStored = (await this.productsInOrderRepository.save(product))[0];
    const products = await this.productsInOrderRepository.getByOrderId(product.shopListId);
    const shopList = await this.orderRepository.getById(product.shopListId);
    shopList.products = products;
    new UpdateTotalsForOrderUseCase(this.orderRepository).execute(shopList);
    return productStored;
  }
}
