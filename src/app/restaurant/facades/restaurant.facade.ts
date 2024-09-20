import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RestaurantSelector } from '../store/restaurant.selectors';
import { AddRestaurantStaff, CreateRestaurant, CreateTable, DeleteRestaurant, DeleteRestaurantStaff, DeleteTable, DowloadQrCode, GetRestaurant, GetRestaurants, GetTable, GetTables, UpdateRestaurant, UpdateRestaurantStaff, UpdateRestaurantStatus, UpdateRestaurantTaxRate, UpdateTable } from '../store/restaurant.actions';


@Injectable({
  providedIn: 'root',
})
export class RestaurantFacade {
  restaurants$: Observable<any> = this.store.select(RestaurantSelector.slices.restaurants);
  selectedRestaurant$: Observable<any> = this.store.select(RestaurantSelector.slices.selectedRestaurant);
  tables$: Observable<any> = this.store.select(RestaurantSelector.slices.tables);
  selectedTable$: Observable<any> = this.store.select(RestaurantSelector.slices.selectedTable);

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

  dispatchUpdateRestaurant(data: any) {
    this.store.dispatch(new UpdateRestaurant(data));
  }

  dispatchDeleteRestaurant(id: any) {
    this.store.dispatch(new DeleteRestaurant(id));
  }

  dispatchUpdateTable(data: any) {
    this.store.dispatch(new UpdateTable(data));
  }

  dispatchDeleteTable(id: any) {
    this.store.dispatch(new DeleteTable(id));
  }

  dispatchGetTable(id: any) {
    this.store.dispatch(new GetTable(id));
  }

  dispatchUpdateRestaurantStaff(data: any, id: any) {
    this.store.dispatch(new UpdateRestaurantStaff(data, id));
  }

  dispatchDeleteRestaurantStaff(id: any) {
    this.store.dispatch(new DeleteRestaurantStaff(id));
  }

  dispatchUpdateRestaurantStatus(data: any) {
    this.store.dispatch(new UpdateRestaurantStatus(data));
  }

  dispatchUpdateRestaurantTaxRate(data: any) {
    this.store.dispatch(new UpdateRestaurantTaxRate(data));
  }
}
