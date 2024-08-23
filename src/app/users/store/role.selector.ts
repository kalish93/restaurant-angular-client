import { createPropertySelectors } from '@ngxs/store';
import { RoleState, RoleStateModel } from './role.state';

export class RoleSelector {
  static slices = createPropertySelectors<RoleStateModel>(RoleState);
}
