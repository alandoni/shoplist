import ShopListsDAO from "../data/database/ShopListsDAO";
import RemoveShopListUseCase from "../domain/use-cases/RemoveShopListUseCase";
import GetAllShopListsUseCase from "../domain/use-cases/GetAllShopListsUseCase";
import ShopListsRepositoryImpl from "../data/repositories/ShopListsRepositoryImpl";
import GetShopListByIdUseCase from "../domain/use-cases/GetShopListByIdUseCase";
import ProductsInShopListsDAO from "../data/database/ProductsInShopListsDAO";
import ProductsInShopListsRepositoryImpl from "../data/repositories/ProductsInShopListsRepositoryImpl";
import RemoveProductFromShopListUseCase from "../domain/use-cases/RemoveProductFromShopListUseCase";
import UpdateProductInShopListUseCase from "../domain/use-cases/UpdateProductInShopListUseCase";
import AddProductToShopListUseCase from "../domain/use-cases/AddProductToShopListUseCase";

export default class DependencyProvider {
  /** --- Use cases --- **/
  static instantiateGetAllShopListsUseCase() {
    return new GetAllShopListsUseCase(DependencyProvider.instantiateShopListsRepositoryImpl());
  }

  static instantiateRemoveShopListUseCase() {
    return new RemoveShopListUseCase(DependencyProvider.instantiateShopListsRepositoryImpl());
  }

  static instantiateGetShopListByIdUseCase() {
    return new GetShopListByIdUseCase(DependencyProvider.instantiateShopListsRepositoryImpl());
  }

  static instantiateSaveShopListUseCase() {
    return new SaveShopListUseCase(
      DependencyProvider.instantiateShopListsRepositoryImpl(),
      DependencyProvider.instantiateProductsInShopListsRepositoryImpl());
  }

  static instantiateAddProductToShopListUseCase() {
    return new AddProductToShopListUseCase(
      DependencyProvider.instantiateShopListsRepositoryImpl(),
      DependencyProvider.instantiateProductsInShopListsRepositoryImpl());
  }

  static instantiateUpdateProductInShopListUseCase() {
    return new UpdateProductInShopListUseCase(
      DependencyProvider.instantiateShopListsRepositoryImpl(),
      DependencyProvider.instantiateProductsInShopListsRepositoryImpl());
  }

  static instantiateRemoveProductFromShopListUseCase() {
    return new RemoveProductFromShopListUseCase(
      DependencyProvider.instantiateShopListsDAO(),
      DependencyProvider.instantiateProductsInShopListsRepositoryImpl());
  }

  static instantiateSaveCategoryUseCase() {
    return new SaveCategoryUseCase(DependencyProvider.instantiateCategoriesRepositoryImpl());
  }

  static instantiateGetAllCategoriesUseCase() {
    return new GetAllCategoriesUseCase(DependencyProvider.instantiateCategoriesRepositoryImpl());
  }

  static instantiateGetProductByIdUseCase() {
    return new GetProductByIdUseCase(DependencyProvider.instantiateProductsRepositoryImpl());
  }

  static instantiateSaveProductUseCase() {
    return new SaveProductUseCase(DependencyProvider.instantiateProductsRepositoryImpl());
  }

  static instantiateGetAllProductsUseCase() {
    return new GetAllProductsUseCase(DependencyProvider.instantiateProductsRepositoryImpl());
  }

  static instantiateSearchProductsByNameUseCase() {
    return new SearchProductsByNameUseCase(DependencyProvider.instantiateProductsRepositoryImpl());
  }

  static instantiateRemoveProductUseCase() {
    return new RemoveProductUseCase(DependencyProvider.instantiateProductsRepositoryImpl());
  }

  static instantiateGetOrderByIdUseCase() {
    return new GetOrderByIdUseCase(
      DependencyProvider.instantiateOrdersRepositoryImpl(),
      DependencyProvider.instantiateProductsInOrderRepositoryImpl());
  }

  static instantiateSaveOrderUseCase() {
    return new SaveOrderUseCase(
      DependencyProvider.instantiateOrdersRepositoryImpl(),
      DependencyProvider.instantiateProductsInOrderRepositoryImpl());
  }

  static instantiateAddProductToOrderUseCase() {
    return new AddProductToOrderUseCase(
      DependencyProvider.instantiateOrdersRepositoryImpl(),
      DependencyProvider.instantiateProductsInOrderRepositoryImpl());
  }

  static instantiateUpdateProductInOrderUseCase() {
    return new UpdateProductInOrderUseCase(
      DependencyProvider.instantiateOrdersRepositoryImpl(),
      DependencyProvider.instantiateProductsInOrderRepositoryImpl());
  }

  static instantiateRemoveProductFromOrderUseCase() {
    return new RemoveProductFromOrderUseCase(
      DependencyProvider.instantiateOrdersRepositoryImpl(),
      DependencyProvider.instantiateProductsInOrderRepositoryImpl());
  }

  /** --- Repositories --- **/
  static instantiateShopListsRepositoryImpl() {
    return new ShopListsRepositoryImpl(DependencyProvider.instantiateShopListsDAO());
  }

  static instantiateProductsInShopListsRepositoryImpl() {
    return new ProductsInShopListsRepositoryImpl(DependencyProvider.instantiateProductsInShopListDAO());
  }

  static instantiateCategoriesRepositoryImpl() {
    return new CategoriesRepositoryImpl(DependencyProvider.instantiateCategoriesDAO());
  }

  static instantiateProductsRepositoryImpl() {
    return new ProductsRepositoryImpl(DependencyProvider.instantiateProductsDAO());
  }

  static instantiateOrdersRepositoryImpl() {
    return new OrdersRepositoryImpl(DependencyProvider.instantiateOrdersDAO());
  }

  static instantiateProductsInOrderRepositoryImpl() {
    return new ProductsInOrderRepositoryImpl(DependencyProvider.instantiateProductsInOrdersDAO());
  }

  /** --- DAOs --- **/
  static instantiateShopListsDAO() {
    return new ShopListsDAO();
  }

  static instanteProductsInShopListsDAO() {
    return new ProductsInShopListsDAO();
  }

  static instantiateCategoriesDAO() {
    return new CategoriesDAO();
  }

  static instantiateProductsDAO() {
    return new ProductsDAO();
  }

  static instantiateOrdersDAO() {
    return new OrdersDAO();
  }

  static instantiateProductsInOrdersDAO() {
    return new ProductsInOrdersDAO();
  }
}