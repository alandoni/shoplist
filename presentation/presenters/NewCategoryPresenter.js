import DataManager from './DataManager';

export default class NewCategoryPresenter {
  constructor(id) {
    this.category = {
      id,
      name: '',
    };
  }

  async saveCategory() {
    if (this.category.id) {
      this.category = await DataManager.updateCategory(this.category.id, this.category.name);
    } else {
      this.category = await DataManager.saveCategory(this.category.name);
    }
    return this.category;
  }

  setName(name) {
    this.category.name = name;
  }
}
