import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { GetRoles } from '../store/role.actions';
import { RoleSelector } from '../store/role.selector';

@Injectable({
  providedIn: 'root',
})
export class RoleFacade {
  roles$: Observable<Role[]> = this.store.select(RoleSelector.slices.roles);

  constructor(private store: Store) {}

  dispatchGetRoles() {
    this.store.dispatch(new GetRoles());
  }
}
