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
export class GetActiveTableOrder {
  static readonly type = `${GetActiveTableOrder.name}`;
  constructor(public tableId:any) {}
}
