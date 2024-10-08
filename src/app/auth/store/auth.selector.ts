import { createPickSelector, createSelector, Selector } from '@ngxs/store';
import { AuthState, AuthStateModel } from './auth.state';

export class AuthSelector {
  static authState = createSelector(
    [AuthState],
    (state: AuthStateModel) => state
  );

  static tokens = createPickSelector(this.authState, [
    'accessToken',
    'refreshToken',
  ]);

  @Selector([AuthState])
  static isAuthenticated(state: AuthStateModel): boolean {

    return !!state.accessToken
  }

  @Selector([AuthState])
  static accessToken(state: AuthStateModel): string | null {
    return state.accessToken;
  }
  @Selector([AuthState])
  static roles(state: AuthStateModel): string | null {
    return state.roles;
  }
  @Selector([AuthState])
  static permissions(state: AuthStateModel): string | null {
    return state.permissions;
  }
}
