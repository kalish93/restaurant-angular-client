import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs';

import { Role } from '../models/role.model';
import { RolesService } from '../services/roles.service';
import {
  SetProgressOff,
  SetProgressOn,
} from 'src/app/core/store/progress-status.actions';
import { GetRoles } from './role.actions';

export interface RoleStateModel {
  roles: Role[];
}

const ROLE_STATE_TOKEN = new StateToken<RoleStateModel>('rolesState');

const defaults = {
  roles: [],
};

@State<RoleStateModel>({
  name: ROLE_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class RoleState {
  constructor(private rolesService: RolesService, private store: Store) {}

  @Action(GetRoles)
  getUsers({ setState }: StateContext<RoleStateModel>) {
    this.store.dispatch(new SetProgressOn());
    return this.rolesService.getRoles().pipe(
      tap((roles) => {
        setState(
          patch({
            roles: roles,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }
}
