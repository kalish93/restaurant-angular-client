import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { Login, Logout } from '../store/auth.actions';
import { AuthSelector } from '../store/auth.selector';

@Injectable({
  providedIn: 'root',
})
export class AuthFacade {
  isAuthenticated$: Observable<boolean> = this.store.select(
    AuthSelector.isAuthenticated
  );

  @Select(AuthSelector.accessToken)
  accessToken$!: Observable<string>;

  @Select(AuthSelector.roles)
  roles$!: Observable<string[]>;

  @Select(AuthSelector.permissions)
  permissions$!: Observable<string[]>;

  constructor(private store: Store) {}

  dispatchLogin(request: LoginRequest) {
    this.store.dispatch(new Login(request));
  }

  dispatchLogout() {
    this.store.dispatch(new Logout());
  }
}
