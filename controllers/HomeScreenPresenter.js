import DataManager from './DataManager';

export default class HomeScreenPresenter {
  getAllShopLists() {
    return DataManager.getAllShopLists().then((shopLists) => {
      this.list = shopLists;
      return this.list;
    });
  }

  deleteShopList(shopList) {
    return DataManager.removeShopList(shopList.id).then(() => this.list.filter(value => value.id !== shopList.id));
  }
}
