import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DashboardSelector } from '../store/dashboard/dashboard.selector';
import { GetNumberOfAdmins, GetNumberOfRestaurants, GetNumberOfRestaurantStaff } from '../store/dashboard/dashboard.actions';

@Injectable({
  providedIn: 'root',
})
export class DashboardFacade {
  numberOfAdmins$: Observable<number> = this.store.select(DashboardSelector.slices.numberOfAdmins);
  numberOfRestaurants$: Observable<number> = this.store.select(DashboardSelector.slices.numberOfRestaurants);
  numberOfRestaurantStaff$: Observable<number> = this.store.select(DashboardSelector.slices.numberOfRestaurantStaff);

  constructor(private store: Store) {}

  dispatchGetNumberOfAdmins() {
    this.store.dispatch(new GetNumberOfAdmins());
  }
  dispatchGetNumberOfRestaurants() {
    this.store.dispatch(new GetNumberOfRestaurants());
  }
  dispatchGetNumberOfRestaurantStaff() {
    this.store.dispatch(new GetNumberOfRestaurantStaff());
  }
}
