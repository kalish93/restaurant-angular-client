import { Selector, createPropertySelectors } from '@ngxs/store';
import { OrderState, OrderStateModel } from './order.state';

export class OrderSelector {
  static slices = createPropertySelectors<OrderStateModel>(OrderState);

  @Selector([OrderState])
  static order(stateModel: OrderStateModel) {
    return stateModel.order;
  }

  @Selector([OrderState])
  static cart(stateModel: OrderStateModel) {
    return stateModel.cart;
  }

  @Selector([OrderState])
  static myTableOrders(stateModel: OrderStateModel) {
    return stateModel.myTableOrders;
  }

}
