import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrderSelector } from '../store/order/order.selectors';
import { AddToCart, GetActiveOrders, GetActiveTableOrder, GetOrderHistory, PlaceOrder, UpdateCart, UpdateOrderStatus } from '../store/order/order.actions';



@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  order$: Observable<any> = this.store.select(OrderSelector.slices.order);
  cart$: Observable<any> = this.store.select(OrderSelector.slices.cart);
  myTableOrders$: Observable<any> = this.store.select(OrderSelector.slices.myTableOrders);
  orderHistory$: Observable<any[]> = this.store.select(OrderSelector.slices.orderHistory);
  activeOrders$: Observable<any[]> = this.store.select(OrderSelector.slices.activeOrders);

  constructor(private store: Store) {}

  dispatchPlaceOrder(data: any) {
    this.store.dispatch(new PlaceOrder(data));
  }

  dispatchAddToCart(data:any){
    this.store.dispatch(new AddToCart(data));
  }

  dispatchUpdateCart(data:any){
    this.store.dispatch(new UpdateCart(data));
  }

  dispatchGetActiveTableOrder(tableId:any){
    this.store.dispatch(new GetActiveTableOrder(tableId));
  }

  dispatchGetActiveOrders(){
    this.store.dispatch(new GetActiveOrders());
  }

  dispatchGetOrderHistory(pageNumber: any, pageSize: any){
    this.store.dispatch(new GetOrderHistory(pageNumber, pageSize));
  }

  dispatchUpdateOrderStatus(data: any){
    this.store.dispatch(new UpdateOrderStatus(data));
  }
}
