import UseCase from './UseCase';

export default class GetOrderByIdUseCase extends UseCase {
  constructor(orderRepository, productsInOrderRepository) {
    super();
    this.orderRepository = orderRepository;
    this.productsInOrderRepository = productsInOrderRepository;
  }

  run = async (id) => {
    const order = await this.orderRepository.getById(id);
    const products = await this.productsInOrderRepository.getByOrderId(id);
    order.products = products.map((product) => {
      const newProduct = product;
      newProduct.totalValue = product.amount * product.value;
      return newProduct;
    });
    return order;
  }
}
