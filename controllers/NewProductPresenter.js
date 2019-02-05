import DataManager from './DataManager';

export default class NewProductPresenter {
  constructor(id) {
    this.product = {
      id, name: '', value: 0, category: '', notes: '',
    };
    this.categories = [];
  }

  async getAllCategories() {
    this.categories = await DataManager.getAllCategories();
    return this.categories;
  }

  async requestProduct() {
    if (!this.product.id) {
      return this.product;
    }
    this.product = await DataManager.getProductById(this.id);
    return this.product;
  }

  async getCategoriesAndProductIfNeeded() {
    await this.getAllCategories();
    await this.requestProduct();
    return {
      product: this.product,
      categories: this.categories,
      category: this.categories[0],
    };
  }

  async saveProduct() {
    if (this.product.id) {
      this.product = await DataManager.updateProduct(
        this.product.id,
        this.product.name,
        this.product.value,
        this.product.notes,
        this.product.category.id,
      );
    } else {
      this.product = await DataManager.saveProduct(
        this.product.name,
        this.product.value,
        this.product.notes,
        this.product.category.id,
      );
    }
    return this.product;
  }

  addCategory(category) {
    this.categories.push(category);
    this.product.category = category;
    this.category = category;
  }

  setName(name) {
    this.product.name = name;
  }

  setValue(value) {
    this.product.value = value;
  }

  setCategory(category) {
    this.product.category = category;
  }

  setNotes(notes) {
    this.product.notes = notes;
  }
}
