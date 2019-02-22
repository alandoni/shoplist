export default class ProductInOrder {
  constructor(productId, orderId, amount, value, id) {
    this.productId = productId;
    this.orderId = orderId;
    this.amount = amount;
    this.value = value;
    this.totalValue = this.amount * this.value;
    this.id = id;
  }
}
