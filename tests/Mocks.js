import ShopList from "../presentation/entities/ShopList";
import Product from "../data/entities/Product";
import Order from "../presentation/entities/Order";
import GenericMemoryDAO from "./GenericMemoryDAO";

const mockShopList = new ShopList('Name of the shop list', [], 0, 0);
const mockProduct = new Product('Name of the product', 4, 1,'Notes', 1);
const mockOrder = new Order(1, 'Name of the ShopList', new Date(), [], 1, 1);

const mockError = 'Error';

jest.mock('../../presentation/DependencyProvider.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      instantiateShopListsDAO: jest.fn(() => new GenericMemoryDAO()),
      instanteProductsInShopListsDAO: jest.fn(() => new GenericMemoryDAO()),
      instantiateCategoriesDAO: jest.fn(() => new GenericMemoryDAO()),
      instantiateProductsDAO: jest.fn(() => new GenericMemoryDAO()),
      instantiateOrdersDAO: jest.fn(() => new GenericMemoryDAO()),
      instantiateProductsInOrdersDAO: jest.fn(() => new GenericMemoryDAO()),
    }
  });
});

export { mockShopList, mockProduct, mockOrder, mockError };