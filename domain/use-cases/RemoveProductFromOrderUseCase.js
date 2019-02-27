import UpdateTotalsForOrderUseCase from './UpdateTotalsForOrderUseCase';
import UseCase from './UseCase';

export default class RemoveProductFromOrderUseCase extends UseCase {
  constructor(ordersRepository, productsInOrderRepository) {
    super();
    this.ordersRepository = ordersRepository;
    this.productsInOrderRepository = productsInOrderRepository;
  }

  run = async (product) => {
    await this.productsInOrderRepository.remove(product.id);
    const products = await this.productsInOrderRepository.getByOrderId(product.shopListId);
    const shopList = await this.ordersRepository.getById(product.shopListId);
    shopList.products = products;
    new UpdateTotalsForOrderUseCase(this.ordersRepository).execute(shopList);
  }
}
