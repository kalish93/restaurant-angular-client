import { Selector, createPropertySelectors } from '@ngxs/store';
import { RestaurantState, RestaurantStateModel } from './restaurant.state';

export class RestaurantSelector {
  static slices = createPropertySelectors<RestaurantStateModel>(RestaurantState);

  @Selector([RestaurantState])
  static restaurants(stateModel: RestaurantStateModel) {
    return stateModel.restaurants;
  }

  @Selector([RestaurantState])
  static selectedRestaurant(stateModel: RestaurantStateModel) {
    return stateModel.selectedRestaurant;
  }

  @Selector([RestaurantState])
  static tables(stateModel: RestaurantStateModel) {
    return stateModel.tables;
  }

  @Selector([RestaurantState])
  static selectedTable(stateModel: RestaurantStateModel) {
    return stateModel.selectedTable;
  }

  @Selector([RestaurantState])
  static creditCards(stateModel: RestaurantStateModel) {
    return stateModel.creditCards;
  }

  @Selector([RestaurantState])
  static discounts(stateModel: RestaurantStateModel) {
    return stateModel.discounts;
  }

  @Selector([RestaurantState])
  static zReportData(stateModel: RestaurantStateModel) {
    return stateModel.zReportData;
  }
}
