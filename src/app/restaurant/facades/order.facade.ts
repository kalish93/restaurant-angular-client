import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrderSelector } from '../store/order/order.selectors';
import {
  AddOrderItem,
  AddToCart,
  GetActiveOrders,
  GetActiveTableOrder,
  GetOrderHistory,
  MarkAsPaid,
  PlaceOrder,
  RemoveOrderItem,
  RequestPayment,
  SaveTipAndDiscount,
  UpdateCart,
  UpdateOrderItem,
  UpdateOrderStatus,
} from '../store/order/order.actions';
import { Cart } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  order$: Observable<any> = this.store.select(OrderSelector.slices.order);
  cart$: Observable<any> = this.store.select(OrderSelector.slices.cart);
  myTableOrders$: Observable<any> = this.store.select(
    OrderSelector.slices.myTableOrders
  );
  orderHistory$: Observable<any[]> = this.store.select(
    OrderSelector.slices.orderHistory
  );
  activeOrders$: Observable<any[]> = this.store.select(
    OrderSelector.slices.activeOrders
  );

  constructor(private store: Store) {}

  dispatchPlaceOrder(data: any, tableId: any) {
    this.store.dispatch(new PlaceOrder(data, tableId));
  }

  dispatchAddToCart(data: Cart) {
    this.store.dispatch(new AddToCart(data));
  }

  dispatchUpdateCart(data: any) {
    this.store.dispatch(new UpdateCart(data));
  }

  dispatchGetActiveTableOrder(tableId: any) {
    this.store.dispatch(new GetActiveTableOrder(tableId));
  }

  dispatchGetActiveOrders() {
    this.store.dispatch(new GetActiveOrders());
  }

  dispatchGetOrderHistory(pageNumber: any, pageSize: any) {
    this.store.dispatch(new GetOrderHistory(pageNumber, pageSize));
  }

  dispatchUpdateOrderStatus(data: any) {
    this.store.dispatch(new UpdateOrderStatus(data));
  }
  dispatchUpdateOrderItem(data: any, tableId: any) {
    this.store.dispatch(new UpdateOrderItem(data, tableId));
  }
  dispatchRemoveOrderItem(itemId: any, tableId: any) {
    this.store.dispatch(new RemoveOrderItem(itemId, tableId));
  }
  dispatchAddOrderItem(data: any, tableId: any) {
    this.store.dispatch(new AddOrderItem(data, tableId));
  }
  dispatchRequestPayment(tableId: any) {
    this.store.dispatch(new RequestPayment(tableId));
  }

  dispatchMarkAsPaid(orderIds: any, tableId: any) {
    this.store.dispatch(new MarkAsPaid(orderIds, tableId));
  }

  dispatchSaveTipAndDiscount(data: any) {
    this.store.dispatch(new SaveTipAndDiscount(data));
  }
}
