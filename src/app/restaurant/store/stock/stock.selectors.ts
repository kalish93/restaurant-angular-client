import { Selector, createPropertySelectors } from '@ngxs/store';
import { StockState, StockStateModel } from './stock.state';

export class StockSelector {
  static slices = createPropertySelectors<StockStateModel>(StockState);

  @Selector([StockState])
  static stocks(stateModel: StockStateModel) {
    return stateModel.stocks;
  }

}
