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
import { AddRestaurantStaff, CreateRestaurant, CreateTable, DeleteRestaurant, DeleteTable, DowloadQrCode, GetRestaurant, GetRestaurants, GetTables, UpdateRestaurant, UpdateTable } from './restaurant.actions';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';

export interface RestaurantStateModel {
  restaurants: PaginatedList<any>;
  selectedRestaurant: any;
  tables: any[]
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
  selectedRestaurant: null,
  tables: []
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

@Action(AddRestaurantStaff)
addRestaurantStaff(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { data }: AddRestaurantStaff
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.addRestaurantStaff(data).pipe(
      tap((result) => {
        const state = getState();

        setState(
          patch({
            selectedRestaurant: {
              ...state.selectedRestaurant,
              users: [...state.selectedRestaurant.users, result],
            },
          })
        );

        this.store.dispatch(new SetProgressOff());

        // Display a success message
        this.operationStatus.displayStatus(
          'Staff added successfully!',
          successStyle,);
      })
  );
}

@Action(GetTables)
getTables(
  { setState }: StateContext<RestaurantStateModel>,
  {  }: GetTables
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.getTables().pipe(
    tap((result) => {
      setState(
        patch({
          tables: result,
        })
      );
      this.store.dispatch(new SetProgressOff());
    })
  );
}

@Action(DowloadQrCode)
dowloadQr(
  { setState }: StateContext<RestaurantStateModel>,
  {tableId, tableNumber}: DowloadQrCode
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.downloadQRCode(tableId).pipe(
    tap(blob => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `table-${tableNumber}-qrcode.png`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
      this.store.dispatch(new SetProgressOff());
    })
  );
}

@Action(CreateTable)
createTable(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { data }: CreateTable
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.createTable(data).pipe(
    tap((result) => {
      const state = getState();

      setState(
        patch({
          tables: [...state.tables, result]
        })
      );

      this.store.dispatch(new SetProgressOff());
      this.store.dispatch(new GetTables())
      // Display a success message
      this.operationStatus.displayStatus(
        'Table Added successfully!',
        successStyle,);
    })
  );
}

@Action(UpdateRestaurant)
updateRestaurant(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { data }: UpdateRestaurant
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.updateRestaurant(data).pipe(
    tap((updatedRestaurant) => {
      const state = getState();

      const updatedItems = state.restaurants.items.map((item) =>
        item.id === data.id ? updatedRestaurant : item
      );

      setState(
        patch({
          restaurants: {
            ...state.restaurants,
            items: updatedItems, // Update the specific restaurant in the list
          },
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Restaurant updated successfully!',
        successStyle,
      );
    })
  );
}

@Action(DeleteRestaurant)
deleteRestaurant(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { id }: DeleteRestaurant
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.deleteRestaurant(id).pipe(
    tap(() => {
      const state = getState();

      const filteredItems = state.restaurants.items.filter(
        (item) => item.id !== id
      );

      setState(
        patch({
          restaurants: {
            ...state.restaurants,
            items: filteredItems, // Remove the restaurant from the list
            totalCount: state.restaurants.totalCount - 1, // Update the total count
          },
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Restaurant deleted successfully!',
        successStyle,
      );
    })
  );
}

@Action(UpdateTable)
updateTable(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { data }: UpdateTable
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.updateTable(data).pipe(
    tap((updatedTable) => {
      const state = getState();

      // Update the specific table in the list
      const updatedTables = state.tables.map((table) =>
        table.id === data.id ? updatedTable : table
      );

      setState(
        patch({
          tables: updatedTables,
        })
      );

      this.store.dispatch(new SetProgressOff());
      this.store.dispatch(new GetTables());
      // Display a success message
      this.operationStatus.displayStatus(
        'Table updated successfully!',
        successStyle,
      );
    })
  );
}

@Action(DeleteTable)
deleteTable(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { id }: DeleteTable
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.deleteTable(id).pipe(
    tap(() => {
      const state = getState();

      // Filter out the deleted table
      const filteredTables = state.tables.filter((table) => table.id !== id);

      setState(
        patch({
          tables: filteredTables,
        })
      );

      this.store.dispatch(new SetProgressOff());
      this.store.dispatch(new GetTables());
      // Display a success message
      this.operationStatus.displayStatus(
        'Table deleted successfully!',
        successStyle,
      );
    })
  );
}

}
