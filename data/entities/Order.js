export default class Order {
  constructor(shopListId, date, totalValue, amountProducts, id) {
    this.shopListId = shopListId;
    this.date = date;
    this.totalValue = totalValue;
    this.amountProducts = amountProducts;
    this.id = id;
  }
}
