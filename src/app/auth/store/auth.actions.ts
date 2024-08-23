import { LoginRequest } from '../models/login-request.model';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public request: LoginRequest) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
