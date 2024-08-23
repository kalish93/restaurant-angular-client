import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { AuthenticationService } from '../services/authentication.service';
import { Login, Logout } from './auth.actions';
import {
  SetProgressOff,
  SetProgressOn,
} from 'src/app/core/store/progress-status.actions';

export interface AuthStateModel {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  username: string | null;
  roles?: any;
  permissions?: any;
  expiresAt?: any;
}

const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>('authState');

@State<AuthStateModel>({
  name: AUTH_STATE_TOKEN,
  defaults: {
    accessToken: null,
    refreshToken: null,
    username: null,
    email: null,
  },
})
@Injectable()
export class AuthState {
  constructor(
    private authService: AuthenticationService,
    private store: Store
  ) {}

  @Action(Login)
  login({ patchState }: StateContext<AuthStateModel>, { request }: Login) {
    this.store.dispatch(new SetProgressOn());
    return this.authService.login(request).pipe(
      tap((result: any) => {
        const currentTime = Math.floor(Date.now() / 1000); // current time in seconds
        const expiresAt = currentTime + result.expires_in;

        patchState({
          accessToken: result.access_token,
          refreshToken: result.refreshToken,
          roles: result.roles,
          permissions: result.permissions,
          expiresAt: expiresAt,
        });
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(Logout)
  logout({ setState }: StateContext<AuthStateModel>) {
    return this.authService.logout().pipe(
      tap(() => {
        setState({
          accessToken: null,
          refreshToken: null,
          username: null,
          email: null,
          roles: null,
          permissions: null,
          expiresAt: null,
        });
      })
    );
  }
}
