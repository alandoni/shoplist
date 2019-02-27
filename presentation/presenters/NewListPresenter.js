import StateObservable from '../StateObservable';
import UpdateProductInList from '../entities/UpdateProductInList';
import ShopList from '../entities/ShopList';
import ProductInList from '../entities/ProductInList';
import DependencyProvider from '../DependencyProvider';

export default class NewListPresenter extends StateObservable {
  constructor(observer, name, id) {
    super();
    this.addObserver(observer);
    this.state = {
      shopList: new ShopList(name, [], 0, 0, id),
      isLoading: true,
      error: null,
      refresh: false,
    };
  }

  async requestShopList() {
    if (this.state.shopList.id) {
      this.state.isLoading = true;
      this.notifyObservers(this.state);
      this.state.shopList = await DependencyProvider.instantiateGetShopListByIdUseCase().execute(this.state.shopList.id);
    }
    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async saveShopList() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    this.state.shopList = await DependencyProvider.instantiateSaveShopListUseCase().execute(this.state.shopList);
    this.state.isLoading = false;
    this.notifyObservers(this.state);
  }

  async addProductToTheList(product) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    const newProduct = new ProductInList(product.id, this.state.shopList.id, 1, product.value);
    this.state.shopList.products.push(newProduct);
    await DependencyProvider.instantiateAddProductToShopListUseCase().execute(newProduct);

    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async updateProductInTheList(product, amount, value) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    const newProduct = new UpdateProductInList(product.id, amount, value);
    this.state.shopList.products.setElement(newProduct, element => element.id === newProduct.id);

    await DependencyProvider.instantiateUpdateProductInShopListUseCase().execute(newProduct);

    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async deleteProductFromList(product) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    await DependencyProvider.instantiateRemoveProductFromShopListUseCase().execute(product.id);
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
