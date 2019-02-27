import StateObservable from '../StateObservable';
import GetAllCategoriesUseCase from '../../domain/use-cases/GetAllCategoriesUseCase';
import GetProductByIdUseCase from '../../domain/use-cases/GetProductByIdUseCase';
import ProductsRepositoryImpl from '../../data/repositories/ProductsRepositoryImpl';
import CategoriesRepositoryImpl from '../../data/repositories/CategoriesRepositoryImpl';
import SaveProductUseCase from '../../domain/use-cases/SaveProductUseCase';
import Product from '../../data/entities/Product';
import DependencyProvider from '../DependencyProvider';

export default class NewProductPresenter extends StateObservable {
  constructor(observer, id) {
    super();
    this.addObserver(observer);
    this.state = {
      product: new Product('', 0, '', null, id),
      categories: [],
      category: null,
      isLoading: true,
    };
  }

  async getAllCategories() {
    this.state.categories = await DependencyProvider.instantiateGetAllCategoriesUseCase().execute();

    if (this.state.categories) {
      this.state.category = this.state.categories[0];
    }
  }

  async requestProduct() {
    if (this.state.product.id) {
      this.state.product = await DependencyProvider.instantiateGetProductByIdUseCase().execute(this.state.product.id);
    }
  }

  async getCategoriesAndProductIfNeeded() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    await this.getAllCategories();
    await this.requestProduct();
    this.state.isLoading = false;
    this.notifyObservers(this.state);
  }

  async saveProduct() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    this.state.product = await DependencyProvider.instantiateSaveProductUseCase().execute(new Product(
      this.state.product.name,
      this.state.product.value,
      this.state.product.notes,
      this.state.product.category.id,
      this.state.product.id,
    ));
    this.state.isLoading = false;
    this.notifyObservers(this.state);
  }

  addCategory(category) {
    this.state.categories.push(category);
    this.state.product.category = category;
    this.state.category = category;
    this.notifyObservers(this.state);
  }

  setName(name) {
    this.product.name = name;
    this.notifyObservers(this.state);
  }

  setValue(value) {
    this.product.value = value;
    this.notifyObservers(this.state);
  }

  setCategory(category) {
    this.product.category = category;
    this.notifyObservers(this.state);
  }

  setNotes(notes) {
    this.product.notes = notes;
    this.notifyObservers(this.state);
  }
}
