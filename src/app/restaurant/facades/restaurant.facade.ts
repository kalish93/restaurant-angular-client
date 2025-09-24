import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RestaurantSelector } from '../store/restaurant.selectors';
import { AddRestaurantStaff, CreateCreditCard, CreateDiscount, CreateRestaurant, CreateTable, DeleteCreditCard, DeleteDiscount, DeleteRestaurant, DeleteRestaurantStaff, DeleteTable, DowloadQrCode, DowloadRestaurantQrCode, GenerateMenuQrCode, GetCreditCards, GetDiscounts, GetRestaurant, GetRestaurants, GetTable, GetTables, GetZreportData, UpdateRestaurant, UpdateRestaurantActiveStatus, UpdateRestaurantStaff, UpdateRestaurantStatus, UpdateRestaurantTaxRate, UpdateTable } from '../store/restaurant.actions';


@Injectable({
  providedIn: 'root',
})
export class RestaurantFacade {
  restaurants$: Observable<any> = this.store.select(RestaurantSelector.slices.restaurants);
  selectedRestaurant$: Observable<any> = this.store.select(RestaurantSelector.slices.selectedRestaurant);
  tables$: Observable<any> = this.store.select(RestaurantSelector.slices.tables);
  selectedTable$: Observable<any> = this.store.select(RestaurantSelector.slices.selectedTable);
  creditCards$: Observable<any> = this.store.select(RestaurantSelector.slices.creditCards);
  discounts$: Observable<any> = this.store.select(RestaurantSelector.slices.discounts);
  zReportData$: Observable<any> = this.store.select(RestaurantSelector.slices.zReportData);

  constructor(private store: Store) {}

  dispatchGetRestaurants(pageNumber: any, pageSize: any) {
    this.store.dispatch(new GetRestaurants(pageNumber, pageSize));
  }

  dispatchCreateRestaurant(data: FormData) {
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

  dispatchUpdateRestaurant(restaurantId: any,data: FormData) {
    this.store.dispatch(new UpdateRestaurant(restaurantId, data));
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

  dispatchCreateCreditCard(data: any) {
    this.store.dispatch(new CreateCreditCard(data));
  }

  dispatchDeleteCreditCard(id: any) {
    this.store.dispatch(new DeleteCreditCard(id));
  }

  dispatchGetCreditCards(restaurantId: any) {
    this.store.dispatch(new GetCreditCards(restaurantId));
  }

  dispatchCreateDiscount(data: any) {
    this.store.dispatch(new CreateDiscount(data));
  }

  dispatchDeleteDiscount(id: any) {
    this.store.dispatch(new DeleteDiscount(id));
  }

  dispatchGetDiscounts(restaurantId: any) {
    this.store.dispatch(new GetDiscounts(restaurantId));
  }

  dispatchGetZreportData(restaurantId: any) {
    this.store.dispatch(new GetZreportData(restaurantId));
  }

  dispatchUpdateRestaurantActiveStatus(data: any) {
    this.store.dispatch(new UpdateRestaurantActiveStatus(data));
  }

  dispatchGenerateMenuQrCode(restaurantId: any) {
    this.store.dispatch(new GenerateMenuQrCode(restaurantId));
  }

  dispatchDownloadMenuQrCode() {
    this.store.dispatch(new DowloadRestaurantQrCode());
  }

}
