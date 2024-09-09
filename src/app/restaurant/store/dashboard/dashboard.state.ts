import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs';

import {
  SetProgressOff,
  SetProgressOn,
} from 'src/app/core/store/progress-status.actions';
import { DashboardService } from '../../services/dashboard.service';
import {
  GetNumberOfAdmins,
  GetNumberOfRestaurants,
  GetNumberOfRestaurantStaff,
} from './dashboard.actions';

export interface DashboardStateModel {
  numberOfAdmins: number;
  numberOfRestaurants: number;
  numberOfRestaurantStaff: number;
}

const DASHBOARD_STATE_TOKEN = new StateToken<DashboardStateModel>(
  'DashboardState'
);

const defaults = {
  numberOfAdmins: 0,
  numberOfRestaurants: 0,
  numberOfRestaurantStaff: 0,
};

@State<DashboardStateModel>({
  name: DASHBOARD_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class DashboardState {
  constructor(
    private store: Store,
    private dashboardService: DashboardService
  ) {}

  @Action(GetNumberOfAdmins)
  getNumberOfAdmins(
    { setState }: StateContext<DashboardStateModel>,
    {}: GetNumberOfAdmins
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.dashboardService.getNumberOfAdmins().pipe(
      tap((result) => {
        setState(
          patch({
            numberOfAdmins: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(GetNumberOfRestaurants)
  getNumberOfRestaurants(
    { setState }: StateContext<DashboardStateModel>,
    {}: GetNumberOfRestaurants
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.dashboardService.getNumberOfRestaurants().pipe(
      tap((result) => {
        setState(
          patch({
            numberOfRestaurants: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }
  
  @Action(GetNumberOfRestaurantStaff)
  getNumberOfRestaurantStaff(
    { setState }: StateContext<DashboardStateModel>,
    {}: GetNumberOfRestaurantStaff
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.dashboardService.getNumberOfRestaurantStaff().pipe(
      tap((result) => {
        setState(
          patch({
            numberOfRestaurantStaff: result,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }
}
