export default class Order {
  constructor(shopListId, name, date, products, totalValue, amountProducts, id) {
    this.shopListId = shopListId;
    this.name = name;
    this.date = date;
    this.products = products;
    this.totalValue = totalValue;
    this.amountProducts = amountProducts;
    this.id = id;
  }
}
