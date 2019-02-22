import StateObservable from '../StateObservable';
import SaveCategoryUseCase from '../../domain/use-cases/SaveCategoryUseCase';
import CategoriesRepositoryImpl from '../../data/repositories/CategoriesRepositoryImpl';

export default class NewCategoryPresenter extends StateObservable {
  constructor(observer, id) {
    super();
    this.addObserver(observer);
    this.state.category = {
      id,
      name: '',
      isLoading: false,
    };
  }

  async saveCategory() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    this.state.category = await new SaveCategoryUseCase(new CategoriesRepositoryImpl()).execute(this.state.category);
    this.state.isLoading = false;
    this.notifyObservers(this.state);
  }

  setName(name) {
    this.state.category.name = name;
    this.notifyObservers(this.state);
  }
}
