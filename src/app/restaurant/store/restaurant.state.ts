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
import { AddRestaurantStaff, CreateCreditCard, CreateDiscount, CreateRestaurant, CreateTable, DeleteCreditCard, DeleteDiscount, DeleteRestaurant, DeleteRestaurantStaff, DeleteTable, DowloadQrCode, GetCreditCards, GetDiscounts, GetRestaurant, GetRestaurants, GetTable, GetTables, GetZreportData, UpdateRestaurant, UpdateRestaurantStaff, UpdateRestaurantStatus, UpdateRestaurantTaxRate, UpdateTable } from './restaurant.actions';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';

export interface RestaurantStateModel {
  restaurants: PaginatedList<any>;
  selectedRestaurant: any;
  tables: any[];
  selectedTable: any;
  creditCards: any[];
  discounts: any[];
  zReportData: any;
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
  tables: [],
  selectedTable: {},
  creditCards: [],
  discounts: [],
  zReportData: null
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

@Action(GetTable)
getTable(
  { setState }: StateContext<RestaurantStateModel>,
  { id }: GetTable
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.getTable(id).pipe(
    tap((result) => {
      setState(
        patch({
          selectedTable: result,
        })
      );
      this.store.dispatch(new SetProgressOff());
    })
  );
}


@Action(UpdateRestaurantStaff)
updateRestaurantStaff(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { data, id }: UpdateRestaurantStaff
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.updateRestaurantStaff(data, id).pipe(
    tap((updatedStaff) => {
      const state = getState();

      setState(
        patch({
          selectedRestaurant: {
            ...state.selectedRestaurant,
            users: state.selectedRestaurant.users.map((staff: any) =>
              staff.id === updatedStaff.id ? updatedStaff : staff
            ),
          },
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Staff updated successfully!',
        successStyle
      );
    })
  );
}


@Action(DeleteRestaurantStaff)
deleteRestaurantStaff(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { id }: DeleteRestaurantStaff
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.deleteRestaurantStaff(id).pipe(
    tap(() => {
      const state = getState();

      setState(
        patch({
          selectedRestaurant: {
            ...state.selectedRestaurant,
            users: state.selectedRestaurant.users.filter(
              (staff: any) => staff.id !== id
            ),
          },
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Staff deleted successfully!',
        successStyle
      );
    })
  );
}

@Action(UpdateRestaurantStatus)
updateRestaurantStatus(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { data }: UpdateRestaurantStatus
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.updateRestaurantStatus(data).pipe(
    tap((updatedRestaurant) => {

      setState(
        patch({
         selectedRestaurant: updatedRestaurant
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Restaurant status updated successfully!',
        successStyle,
      );
    })
  );
}

@Action(UpdateRestaurantTaxRate)
updateRestaurantTaxRate(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { data }: UpdateRestaurantTaxRate
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.updateRestaurantTaxRate(data).pipe(
    tap((updatedRestaurant) => {

      setState(
        patch({
         selectedRestaurant: updatedRestaurant
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Restaurant tax rate updated successfully!',
        successStyle,
      );
    })
  );
}

@Action(GetCreditCards)
  getCreditCards(
    { setState }: StateContext<RestaurantStateModel>,
    { restaurantId }: GetCreditCards
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.restaurantService.getCreditCards(restaurantId).pipe(
      tap((result) => {
        setState(
          patch({
            creditCards: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(CreateCreditCard)
  createCreditCard(
    { setState, getState }: StateContext<RestaurantStateModel>,
    { data }: CreateCreditCard
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.restaurantService.createCreditCard(data).pipe(
      tap((result) => {
        const state = getState();
        setState(
          patch({
            creditCards: [result, ...state.creditCards],
          })
        );

        this.store.dispatch(new SetProgressOff());

        // Display a success message
        this.operationStatus.displayStatus(
          'Card added successfully!',
          successStyle,);
      })
    );
  }


  @Action(DeleteCreditCard)
deleteCreditCard(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { id }: DeleteCreditCard
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.deleteCreditCard(id).pipe(
    tap(() => {
      const state = getState();

      setState(
        patch({
          creditCards: state.creditCards.filter((card: any) => card.id !== id),
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Card removed successfully!',
        successStyle
      );
    })
  );
}

@Action(GetDiscounts)
  getDiscounts(
    { setState }: StateContext<RestaurantStateModel>,
    { restaurantId }: GetDiscounts
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.restaurantService.getDiscounts(restaurantId).pipe(
      tap((result) => {
        setState(
          patch({
            discounts: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(CreateDiscount)
  createDiscount(
    { setState, getState }: StateContext<RestaurantStateModel>,
    { data }: CreateDiscount
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.restaurantService.createDiscounts(data).pipe(
      tap((result) => {
        const state = getState();
        setState(
          patch({
            discounts: [result, ...state.discounts],
          })
        );

        this.store.dispatch(new SetProgressOff());

        // Display a success message
        this.operationStatus.displayStatus(
          'Discount added successfully!',
          successStyle,);
      })
    );
  }


  @Action(DeleteDiscount)
deleteDiscount(
  { setState, getState }: StateContext<RestaurantStateModel>,
  { id }: DeleteDiscount
) {
  this.store.dispatch(new SetProgressOn());
  return this.restaurantService.deleteDiscount(id).pipe(
    tap(() => {
      const state = getState();

      setState(
        patch({
          discounts: state.discounts.filter((discount: any) => discount.id !== id),
        })
      );

      this.store.dispatch(new SetProgressOff());

      // Display a success message
      this.operationStatus.displayStatus(
        'Discount removed successfully!',
        successStyle
      );
    })
  );
}

@Action(GetZreportData)
getZreportData(
    { setState }: StateContext<RestaurantStateModel>,
    { restaurantId }: GetZreportData
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.restaurantService.getZreportData(restaurantId).pipe(
      tap((result) => {
        setState(
          patch({
            zReportData: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

}
