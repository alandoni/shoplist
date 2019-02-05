import DataManager from './DataManager';

export default class HomeScreenPresenter {
  async getAllShopLists() {
    this.list = await DataManager.getAllShopLists();
    return this.list;
  }

  async deleteShopList(shopList) {
    await DataManager.removeShopList(shopList.id);
    this.list.filter(value => value.id !== shopList.id);
    return this.list;
  }
}
