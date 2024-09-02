export class PlaceOrder {
  static readonly type = `${PlaceOrder.name}`;
  constructor(public order:any) {}
}

export class AddToCart {
  static readonly type = `${AddToCart.name}`;
  constructor(public data:any) {}
}
export class UpdateCart {
  static readonly type = `${UpdateCart.name}`;
  constructor(public cart:any) {}
}
export class GetActiveOrders {
  static readonly type = `${GetActiveOrders.name}`;
  constructor() {}
}
export class GetOrderHistory {
  static readonly type = `${GetOrderHistory.name}`;
  constructor(
    public pageNumber: any,
    public pageSize: any,
  ) {}
}
export class GetActiveTableOrder {
  static readonly type = `${GetActiveTableOrder.name}`;
  constructor(public tableId:any) {}
}
export class UpdateOrderStatus {
  static readonly type = `${UpdateOrderStatus.name}`;
  constructor(public data:any) {}
}
