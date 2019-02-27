import AddProcuctToOrderUseCase from '../domain/use-cases/AddProductToOrderUseCase';
import OrdersRepository from '../domain/repositories/OrdersRepository';
import ProductsInOrderRepository from '../domain/repositories/ProductsInOrderRepository';
import UpdateTotalsForOrderUseCase from '../domain/use-cases/UpdateTotalsForOrderUseCase';

const mockProduct = {productId: 3, amount: 1, value: 4, orderId: 1};
const mockOrder = {products: [], id: 1, shopListId: 1};

jest.mock('../domain/repositories/ProductsInOrderRepository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      save: jest.fn(() => {
        mockProduct.id = 1;
        return mockProduct;
      }),
      getByOrderId: jest.fn(() => {
        return [mockProduct];
      }),
    };
  });
});

jest.mock('../domain/repositories/OrdersRepository', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getById: jest.fn(() => {
        return mockOrder;
      }),
    };
  });
});

jest.mock('../domain/use-cases/UpdateTotalsForOrderUseCase', () => {
  return jest.fn().mockImplementation(() => {
    return {
      execute: jest.fn(() => {
        return mockOrder;
      }),
    };
  });
});

describe('Test AddProductToOrderUseCase', () => {
  let useCase;

  beforeEach(() => {
    useCase = new AddProcuctToOrderUseCase(new OrdersRepository(), new ProductsInOrderRepository());
  });

  it('Execute', async () => {
    const spy = jest.spyOn(useCase.productsInOrderRepository, 'save');
    const spy2 = jest.spyOn(useCase.productsInOrderRepository, 'getByOrderId');
    const spy3 = jest.spyOn(useCase.orderRepository, 'getById');

    await useCase.execute(mockProduct);

    expect(spy).toBeCalledWith(mockProduct);
    expect(spy2).toBeCalledWith(mockProduct.orderId);
    expect(spy3).toBeCalledWith(mockProduct.orderId);

    expect(UpdateTotalsForOrderUseCase).toBeCalledTimes(1);
  });
});
