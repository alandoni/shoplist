import GetAllShopListsUseCase from '../../domain/use-cases/GetAllShopListsUseCase';
import RemoveShopListUseCase from '../../domain/use-cases/RemoveShopListUseCase';
import ShopListsRepositoryImpl from '../../data/repositories/ShopListsRepositoryImpl';
import StateObservable from '../StateObservable';

export default class HomeScreenPresenter extends StateObservable {
  constructor(observer) {
    super();
    this.addObserver(observer);
    this.state = {
      isLoading: true, refresh: false, error: null, shopLists: [],
    };
  }

  async getAllShopLists() {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    try {
      this.state.shopLists = await new GetAllShopListsUseCase(new ShopListsRepositoryImpl()).execute();
      this.state.refresh = !this.state.refresh;      
    } catch (error) {
      this.state.error = error.message;
    }
    this.state.isLoading = false;
    this.notifyObservers(this.state);
  }

  async deleteShopList(shopList) {
    this.state.isLoading = true;
    this.notifyObservers(this.state);
    try {
      await new RemoveShopListUseCase(new ShopListsRepositoryImpl()).execute(shopList.id);
      this.state.shopLists = this.state.shopLists.filter(value => value.id !== shopList.id);
      this.state.refresh = !this.state.refresh;    
    } catch (error) {
      this.state.error = error.message;
    }
    this.state.isLoading = false;
    this.notifyObservers(this.state);
  }
}
