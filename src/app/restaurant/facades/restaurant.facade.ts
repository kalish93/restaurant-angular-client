import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RestaurantSelector } from '../store/restaurant.selectors';
import { CreateRestaurant, GetRestaurant, GetRestaurants } from '../store/restaurant.actions';


@Injectable({
  providedIn: 'root',
})
export class RestaurantFacade {
  restaurants$: Observable<any> = this.store.select(RestaurantSelector.slices.restaurants);
  selectedRestaurant$: Observable<any> = this.store.select(RestaurantSelector.slices.selectedRestaurant);

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
}
