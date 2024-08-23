import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import {
  insertItem,
  patch,
  removeItem,
  updateItem,
} from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { OperationStatusService } from 'src/app/core/services/operation-status/operation-status.service';
import { successStyle } from 'src/app/core/services/operation-status/status-style-names';

import {
  SetProgressOff,
  SetProgressOn,
} from 'src/app/core/store/progress-status.actions';
import { RestaurantService } from '../services/restaurant.service';
import { CreateRestaurant, GetRestaurant, GetRestaurants } from './restaurant.actions';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';

export interface RestaurantStateModel {
  restaurants: PaginatedList<any>;
  selectedRestaurant: any;
}

const RESTAURANT_STATE_TOKEN = new StateToken<RestaurantStateModel>(
  'restaurantState'
);

const defaults = {
  restaurants: {
    items: [],
    pageNumber: 0,
    totalPages: 0,
    totalCount: 0,
  },
  selectedRestaurant: null
};

@State<RestaurantStateModel>({
  name: RESTAURANT_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class RestaurantState {
  constructor(
    private restaurantService: RestaurantService,
    private operationStatus: OperationStatusService,
    private store: Store
  ) {}

  @Action(GetRestaurants)
  getRestaurants(
    { setState }: StateContext<RestaurantStateModel>,
    { pageNumber, pageSize }: GetRestaurants
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.restaurantService.getRestaurants(pageNumber, pageSize).pipe(
      tap((result) => {
        setState(
          patch({
            restaurants: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(CreateRestaurant)
createRestaurant(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { data }: CreateRestaurant
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.createRestaurant(data).pipe(
    tap((result) => {
      const state = getState();

      setState(
        patch({
          restaurants: {
            ...state.restaurants,
            items: [...state.restaurants.items, result], // Insert the new restaurant
            totalCount: state.restaurants.totalCount + 1, // Update the total count
          },
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Restaurant created successfully!',
        successStyle,);
    })
  );
}

@Action(GetRestaurant)
getRestaurant(
  { setState }: StateContext<RestaurantStateModel>,
  { id }: GetRestaurant
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.getRestaurant(id).pipe(
    tap((result) => {
      setState(
        patch({
          selectedRestaurant: result,
        })
      );
      this.store.dispatch(new SetProgressOff());
    })
  );
}
}
