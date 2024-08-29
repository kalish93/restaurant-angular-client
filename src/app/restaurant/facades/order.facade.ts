import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { OrderSelector } from '../store/order/order.selectors';
import { AddToCart, GetActiveTableOrder, PlaceOrder, UpdateCart } from '../store/order/order.actions';



@Injectable({
  providedIn: 'root',
})
export class OrderFacade {
  order$: Observable<any> = this.store.select(OrderSelector.slices.order);
  cart$: Observable<any> = this.store.select(OrderSelector.slices.cart);
  myTableOrders$: Observable<any> = this.store.select(OrderSelector.slices.myTableOrders);

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
}
