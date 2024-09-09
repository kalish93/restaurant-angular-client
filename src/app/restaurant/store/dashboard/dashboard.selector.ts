import { Selector, createPropertySelectors } from '@ngxs/store';
import { DashboardState, DashboardStateModel } from './dashboard.state';

export class DashboardSelector {
  static slices = createPropertySelectors<DashboardStateModel>(DashboardState);

  @Selector([DashboardState])
  static numberOfAdmins(stateModel: DashboardStateModel) {
    return stateModel.numberOfAdmins;
  }

  @Selector([DashboardState])
  static numberOfRestaurants(stateModel: DashboardStateModel) {
    return stateModel.numberOfRestaurants;
  }

  @Selector([DashboardState])
  static numberOfRestaurantStaff(stateModel: DashboardStateModel) {
    return stateModel.numberOfRestaurantStaff;
  }

}
