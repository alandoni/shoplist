import StateObservable from '../StateObservable';
import Category from '../../data/entities/Category';
import DependencyProvider from '../DependencyProvider';

export default class NewCategoryPresenter extends StateObservable {
  constructor(observer, id) {
    super();
    this.addObserver(observer);
    this.state = {
      category: new Category('', id),
      isLoading: false,
    };
  }

  async saveCategory() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    this.state.category = await DependencyProvider.instantiateSaveCategoryUseCase().execute(this.state.category);
    this.state.isLoading = false;
    this.notifyObservers(this.state);
  }

  setName(name) {
    this.state.category.name = name;
    this.notifyObservers(this.state);
  }
}
