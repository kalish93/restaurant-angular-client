import { ForgetPasswordRequest } from '../models/forget-password-request.model';
import { ResetPasswordRequest } from '../models/reset-password-request.model';
import { ChangePasswordRequest } from '../models/change-password-request.model';
import { User } from '../models/user.model';

export class GetUsers {
  static readonly type = `[Users] ${GetUsers.name}`;
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number
  ) {}
}
export class GetAdmins {
  static readonly type = `[Users] ${GetAdmins.name}`;
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number
  ) {}
}

export class GetUsersByRoleId {
  static readonly type = `[Users] ${GetUsersByRoleId.name}`;
  constructor(
    public readonly roleId: string,
    public readonly pageNumber: number,
    public readonly pageSize: number
  ) {}
}

export class GetUsersByMultipleRoleIds {
  static readonly type = `[Users] ${GetUsersByMultipleRoleIds.name}`;
  constructor(
    public readonly roleIds: string[],
    public readonly pageNumber?: number,
    public readonly pageSize?: number
  ) {}
}

export class GetUsersBySearch {
  static readonly type = `[Users] ${GetUsersBySearch.name}`;
  constructor(
    public readonly search: string,
    public readonly pageNumber: number,
    public readonly pageSize: number
  ) {}
}

export class SelectUser {
  static readonly type = `[Users] ${SelectUser.name}`;
  constructor(public user: User) {}
}

export class RegisterUser {
  static readonly type = `[Users] ${RegisterUser.name}`;
  constructor(public user: User) {}
}

export class UpdateUser {
  static readonly type = `[Users] ${UpdateUser.name}`;
  constructor(public id: string, public user: User) {}
}

export class UpdateUserRole {
  static readonly type = `[Users] ${UpdateUserRole.name}`;
  constructor(public id: string, public roleId: string) {}
}

export class DeleteUser {
  static readonly type = `[Users] ${DeleteUser.name}`;
  constructor(public id: string) {}
}

export class ForgetPassword {
  static readonly type = `[Users] ${ForgetPassword.name}`;
  constructor(public forgetPassword: ForgetPasswordRequest) {}
}
export class ResetForgetPasswordStatus {
  static readonly type = `[Users] ${ResetForgetPasswordStatus.name}`;
  constructor() {}
}

export class ResetPassword {
  static readonly type = `[Users] ${ResetPassword.name}`;
  constructor(public resetPassword: ResetPasswordRequest) {}
}

export class ResetResetPasswordStatus {
  static readonly type = `[Users] ${ResetResetPasswordStatus.name}`;
  constructor() {}
}
export class ToggleStatus {
  static readonly type = `[Users] ${ToggleStatus.name}`;
  constructor(public id?: string) {}
}

export class ChangePassword {
  static readonly type = `[Users] ${ChangePassword.name}`;
  constructor(public changePassword: ChangePasswordRequest) {}
}

export class ResetChangePasswordStatus {
  static readonly type = `[Users] ${ResetChangePasswordStatus.name}`;
  constructor() {}
}

export class GetUsersByRolesAndOffices {
  static readonly type = `[Users] ${GetUsersByRolesAndOffices.name}`;

  constructor(public roleIds: string[], public officeIds: string[]) {}
}

export class SetFilterdUsersEmpty {
  static readonly type = `[Users] ${SetFilterdUsersEmpty.name}`;
  constructor() {}
}

export class GetApprovers {
  static readonly type = `[Users] ${GetApprovers.name}`;
  constructor(
    public readonly roleIds: string[],
    public readonly pageNumber?: number,
    public readonly pageSize?: number
  ) {}
}
export class GetEvaluators {
  static readonly type = `[Users] ${GetEvaluators.name}`;
  constructor(
    public readonly roleIds: string[],
    public readonly pageNumber?: number,
    public readonly pageSize?: number
  ) {}
}

export class SetApproversAndEvaluatorsEmpty {
  static readonly type = `[Users] ${SetApproversAndEvaluatorsEmpty.name}`;
  constructor() {}
}
