export class PlaceOrder {
  static readonly type = `${PlaceOrder.name}`;
  constructor(public order:any, public tableId: any) {}
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

export class RemoveOrderItem {
  static readonly type = `${RemoveOrderItem.name}`;
  constructor(public itemId:any,public tableId: any) {}
}
export class UpdateOrderItem {
  static readonly type = `${UpdateOrderItem.name}`;
  constructor(public data:any, public tableId: any) {}
}
export class AddOrderItem {
  static readonly type = `${AddOrderItem.name}`;
  constructor(public data:any, public tableId: any) {}
}

export class RequestPayment {
  static readonly type = `${RequestPayment.name}`;
  constructor(public tableId: any) {}
}
export class MarkAsPaid {
  static readonly type = `${MarkAsPaid.name}`;
  constructor(public orderIds: any, public tableId: any) {}
}
export class SaveTipAndDiscount {
  static readonly type = `${SaveTipAndDiscount.name}`;
  constructor(public data: any) {}
}
