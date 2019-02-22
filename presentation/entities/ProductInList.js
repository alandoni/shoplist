export default class ProductInList {
  constructor(productId, shopListId, amount, value, id) {
    this.productId = productId;
    this.shopListId = shopListId;
    this.amount = amount;
    this.value = value;
    this.totalValue = this.amount * this.value;
    this.id = id;
  }
}
