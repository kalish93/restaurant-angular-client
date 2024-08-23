import { Selector, createPropertySelectors } from '@ngxs/store';
import { UserState, UserStateModel } from './user.state';
export class UserSelector {
  static slices = createPropertySelectors<UserStateModel>(UserState);

  @Selector([UserState])
  static approvers(stateModel: UserStateModel) {
    return stateModel.approvers;
  }
  @Selector([UserState])
  static evaluators(stateModel: UserStateModel) {
    return stateModel.evaluators;
  }
}
