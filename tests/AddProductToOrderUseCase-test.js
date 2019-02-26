import AddProcuctToOrderUseCase from '../domain/use-cases/AddProductToOrderUseCase';
import OrdersRepository from '../domain/repositories/OrdersRepository';
import ProductsInOrderRepository from '../domain/repositories/ProductsInOrderRepository';
import UpdateTotalsForOrderUseCase from '../domain/use-cases/UpdateTotalsForOrderUseCase';

const product = {procuctId: 3, amount: 1, value: 4, shopListId: 1};

describe('Test AddProductToOrderUseCase', () => {
  let useCase;

  beforeEach(() => {
    useCase = new AddProcuctToOrderUseCase(new OrdersRepository, new ProductsInOrderRepository());
  });

  it('Execute', () => {

    useCase.run(product);

    /*expect(spy).toBeCalledWith(product);
    expect(spy2).toBeCalledWith(product.shopListId);
    expect(spy3).toBeCalledWith(product.shopListId);
    expect(UpdateTotalsForOrderUseCase).toBeCalledTimes(1);*/
  });
});
