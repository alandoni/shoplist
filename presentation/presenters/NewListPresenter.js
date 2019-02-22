import StateObservable from '../StateObservable';
import ShopListsRepositoryImpl from '../../data/repositories/ShopListsRepositoryImpl';
import SaveShopListUseCase from '../../domain/use-cases/SaveShopListUseCase';
import ProductsInShopListsRepositoryImpl from '../../data/repositories/ProductsInShopListsRepositoryImpl';
import AddProductToShopListUseCase from '../../domain/use-cases/AddProductToShopListUseCase';
import GetShopListByIdUseCase from '../../domain/use-cases/GetShopListByIdUseCase';
import RemoveProductFromShopListUseCase from '../../domain/use-cases/RemoveProductFromShopListUseCase';
import UpdateProductInShopListUseCase from '../../domain/use-cases/UpdateProductInShopListUseCase';
import ProductInShopList from '../../data/entities/ProductInShopList';

export default class NewListPresenter extends StateObservable {
  constructor(observer, name, id) {
    super();
    this.addObserver(observer);
    this.state = {
      shopList: {
        name, id, products: [], amountProducts: 0, totalValue: 0,
      },
      isLoading: true,
      error: null,
      refresh: false,
    };
  }

  async requestShopList() {
    if (this.state.shopList.id) {
      this.state.isLoading = true;
      this.notifyObservers(this.state);
      this.state.shopList = await new GetShopListByIdUseCase(
        new ShopListsRepositoryImpl(),
        new ProductsInShopListsRepositoryImpl(),
      ).execute(this.state.shopList.id);
    }
    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async saveShopList() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    this.state.shopList = await new SaveShopListUseCase(
      new ShopListsRepositoryImpl(),
      new ProductsInShopListsRepositoryImpl(),
    ).execute(this.state.shopList);
    this.state.isLoading = false;
    this.notifyObservers(this.state);
  }

  async addProductToTheList(product) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    const newProduct = new ProductInShopList(product.id, this.state.shopList.id, 1, product.value);
    this.state.shopList.products.push(newProduct);
    await new AddProductToShopListUseCase(
      new ShopListsRepositoryImpl(),
      new ProductsInShopListsRepositoryImpl(),
    ).execute(newProduct);

    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async updateProductInTheList(product, amount, value) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    const newProduct = new ProductInShopList(product.productId, this.state.shopList.id, amount, value, product.id);
    this.state.shopList.products.setElement(newProduct, element => element.id === newProduct.id);

    await new UpdateProductInShopListUseCase(
      new ShopListsRepositoryImpl(),
      new ProductsInShopListsRepositoryImpl(),
    ).execute(newProduct);

    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async deleteProductFromList(product) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    await new RemoveProductFromShopListUseCase(
      new ShopListsRepositoryImpl(),
      new ProductsInShopListsRepositoryImpl(),
    ).execute(product.id);
    this.state.shopList.products = this.state.shopList.products.filter(value => value.id !== product.id);

    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  setName(name) {
    this.state.shopList.name = name;
    this.notifyObservers(this.state);
  }
}
