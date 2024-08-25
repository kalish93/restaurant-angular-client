import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RestaurantSelector } from '../store/restaurant.selectors';
import { AddRestaurantStaff, CreateRestaurant, CreateTable, DowloadQrCode, GetRestaurant, GetRestaurants, GetTables } from '../store/restaurant.actions';


@Injectable({
  providedIn: 'root',
})
export class RestaurantFacade {
  restaurants$: Observable<any> = this.store.select(RestaurantSelector.slices.restaurants);
  selectedRestaurant$: Observable<any> = this.store.select(RestaurantSelector.slices.selectedRestaurant);
  tables$: Observable<any> = this.store.select(RestaurantSelector.slices.tables);

  constructor(private store: Store) {}

  dispatchGetRestaurants(pageNumber: any, pageSize: any) {
    this.store.dispatch(new GetRestaurants(pageNumber, pageSize));
  }

  dispatchCreateRestaurant(data: any) {
    this.store.dispatch(new CreateRestaurant(data));
  }

  dispatchGetRestaurant(id: any) {
    this.store.dispatch(new GetRestaurant(id));
  }

  dispatchAddRestaurantStaff(data: any) {
    this.store.dispatch(new AddRestaurantStaff(data));
  }

  dispatchGetTables() {
    this.store.dispatch(new GetTables());
  }

  dispatchCreateTable(data: any) {
    this.store.dispatch(new CreateTable(data));
  }

  dispatchDowloadQrCode(id: any, tableNumber: any) {
    this.store.dispatch(new DowloadQrCode(id, tableNumber));
  }
}
