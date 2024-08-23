import { Selector, createPropertySelectors } from '@ngxs/store';
import { DateTimeState, DateTimeStateModel } from './detetime.state';

export class DateTimeSelector {
  static slices = createPropertySelectors(DateTimeState);

  @Selector([DateTimeState])
  static datetime(stateModel: DateTimeStateModel) {
    return stateModel.dateTime;
  }
}
