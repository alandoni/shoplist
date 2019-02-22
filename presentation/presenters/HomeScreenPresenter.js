import GetAllShopListsUseCase from '../../domain/use-cases/GetAllShopListsUseCase';
import RemoveShopListUseCase from '../../domain/use-cases/RemoveShopListUseCase';
import ShopListsRepositoryImpl from '../../data/repositories/ShopListsRepositoryImpl';
import StateObservable from '../StateObservable';

export default class HomeScreenPresenter extends StateObservable {
  constructor(observer) {
    super();
    this.addObserver(observer);
    this.state = {
      isLoading: true, refresh: false, error: null, shopLists: null,
    };
  }

  async getAllShopLists() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    this.state.shopLists = await new GetAllShopListsUseCase(new ShopListsRepositoryImpl()).execute();
    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }

  async deleteShopList(shopList) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    await new RemoveShopListUseCase(new ShopListsRepositoryImpl()).execute(shopList.id);
    this.state.data = this.state.data.filter(value => value.id !== shopList.id);
    this.state.isLoading = false;
    this.state.refresh = !this.state.refresh;
    this.notifyObservers(this.state);
  }
}
