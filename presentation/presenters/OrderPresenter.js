import StateObservable from '../StateObservable';
import Order from '../entities/Order';
import ProductInList from '../entities/ProductInList';
import UpdateProductInList from '../entities/UpdateProductInList';
import DependencyProvider from '../DependencyProvider';

export default class OrderPresenter extends StateObservable {
  constructor(observer, id, shopListId, name) {
    super();
    this.addObserver(observer);
    const date = new Date();
    this.state = {
      order: new Order(shopListId, name, date, [], 0, 0, id),
      isLoading: true,
      refresh: false,
    };
  }

  async getOrder() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    if (this.state.order.id) {
      this.state.order = await DependencyProvider.instantiateGetOrderByIdUseCase().execute(this.state.order.id);
    } else {
      const shopList = await DependencyProvider.instantiateGetShopListByIdUseCase().execute(this.state.order.id);
      this.state.order.shopListId = shopList.id;
      this.state.order.name = shopList.name;
      this.state.order.products = shopList.products;
      this.state.order.totalValue = shopList.totalValue;
      this.state.order.amountProducts = shopList.amountProducts;
    }
    this.state.isLoading = true;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async saveOrder() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    this.state.order = await DependencyProvider.instantiateSaveOrderUseCase().execute(this.state.order);
    this.state.isLoading = true;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async addProductToTheList(product) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    const newProduct = new ProductInList(product.id, this.state.order.id, 1, product.value);
    this.state.order.products.push(newProduct);
    await DependencyProvider.instantiateAddProductToOrderUseCase().execute(newProduct);

    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async updateProductInTheList(product, amount, value) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    const newProduct = new UpdateProductInList(product.id, amount, value);
    this.state.order.products.setElement(newProduct, element => element.id === newProduct.id);

    await DependencyProvider.instantiateUpdateProductInOrderUseCase().execute(newProduct);

    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async deleteProductFromList(product) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);

    await DependencyProvider.instantiateRemoveProductFromOrderUseCase().execute(product.id);
    this.state.order.products = this.state.order.products.filter(value => value.id !== product.id);

    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }
}
