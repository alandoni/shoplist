import StateObservable from '../StateObservable';
import GetAllCategoriessUseCase from '../../domain/use-cases/GetAllCategoriesUseCase';
import GetProductByIdUseCase from '../../domain/use-cases/GetProductByIdUseCase';
import ProductsRepositoryImpl from '../../data/repositories/ProductsRepositoryImpl';
import CategoriesRepositoryImpl from '../../data/repositories/CategoriesRepositoryImpl';
import SaveProductUseCase from '../../domain/use-cases/SaveProductUseCase';
import Product from '../../data/entities/Product';

export default class NewProductPresenter extends StateObservable {
  constructor(observer, id) {
    super();
    this.addObserver(observer);
    this.state = {
      product: {
        id, name: '', value: 0, category: '', notes: '',
      },
      categories: [],
      category: null,
      isLoading: true,
    };
  }

  async getAllCategories() {
    this.state.categories = await new GetAllCategoriessUseCase(new CategoriesRepositoryImpl()).getAllCategories();
    this.state.category = this.state.categories[0];
    return this.state.categories;
  }

  async requestProduct() {
    if (this.state.product.id) {
      this.state.product = await new GetProductByIdUseCase(new ProductsRepositoryImpl()).execute(this.state.product.id);
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
    this.state.product = await new SaveProductUseCase(new ProductsRepositoryImpl()).execute(new Product(
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
