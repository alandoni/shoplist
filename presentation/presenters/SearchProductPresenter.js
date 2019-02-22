import ProductsRepositoryImpl from '../../data/repositories/ProductsRepositoryImpl';
import SearchProductsByNameUseCase from '../../domain/use-cases/SearchProductsByNameUseCase';
import RemoveProductUseCase from '../../domain/use-cases/RemoveProductUseCase';
import StateObservable from '../StateObservable';
import GetAllProductsUseCase from '../../domain/use-cases/GetAllProductsUseCase';

export default class SearchProductPresenter extends StateObservable {
  constructor(observer) {
    super();
    this.addObserver(observer);
    this.state = {
      products: [],
      search: '',
      isLoading: true,
      refresh: false,
    };
  }

  async getProducts() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    if (!this.state.search || this.state.search.length === 0) {
      this.state.products = await new GetAllProductsUseCase(new ProductsRepositoryImpl()).execute();
    } else {
      this.state.products = await new SearchProductsByNameUseCase(
        new ProductsRepositoryImpl(),
      ).execute(this.state.search);
    }
    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  search(search) {
    this.state.search = search;
    this.notifyObservers(this.state);
  }

  async deleteProduct(product) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    await new RemoveProductUseCase(new ProductsRepositoryImpl()).execute(product.id);
    this.state.products = this.state.products.filter(value => value.id !== product.id);
    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }
}
