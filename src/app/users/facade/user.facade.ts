import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ForgetPasswordRequest } from '../models/forget-password-request.model';
import { ResetPasswordRequest } from '../models/reset-password-request.model';
import {
  ChangePassword,
  DeleteUser,
  GetUsers,
  GetUsersByRoleId,
  GetUsersBySearch,
  RegisterUser,
  ResetChangePasswordStatus,
  SelectUser,
  UpdateUser,
  ForgetPassword,
  ResetForgetPasswordStatus,
  ResetPassword,
  ResetResetPasswordStatus,
  GetAdmins,
  ToggleStatus,
  UpdateUserRole,
  GetUsersByRolesAndOffices,
  SetFilterdUsersEmpty,
  GetUsersByMultipleRoleIds,
  GetApprovers,
  GetEvaluators,
  SetApproversAndEvaluatorsEmpty,
} from '../store/user.actions';
import { UserSelector } from '../store/user.selector';
import { ChangePasswordRequest } from '../models/change-password-request.model';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  users$: Observable<PaginatedList<User>> = this.store.select(UserSelector.slices.users);
  selectedUser$: Observable<User | null> = this.store.select(
    UserSelector.slices.selectedUser
  );

  isForgetPasswordSuccessful$: Observable<boolean> = this.store.select(
    UserSelector.slices.isForgetPasswordSuccessful
  );

  isResetPasswordSuccessful$: Observable<boolean> = this.store.select(
    UserSelector.slices.isResetPasswordSuccessful
  );
  isChangePasswordSuccessful$: Observable<boolean> = this.store.select(
    UserSelector.slices.isChangePasswordSuccessful
  );

  filterdUsers$: Observable<User[]> = this.store.select(
    UserSelector.slices.filterdUsers
  );

  filteredUsersByMultipleRoles$: Observable<User[]> = this.store.select(
    UserSelector.slices.filteredUsersByMultipleRoles
  );

  constructor(private store: Store) {}

  @Select(UserSelector.approvers)
  approvers$!: Observable<User[]>;

  @Select(UserSelector.evaluators)
  evaluators$!: Observable<User[]>;

  dispatchRegisterUser(user: User) {
    this.store.dispatch(new RegisterUser(user));
  }

  dispatchSelectUser(user: User) {
    this.store.dispatch(new SelectUser(user));
  }

  dispatchGetUsers(pageNumber: number, pageSize: number) {
    this.store.dispatch(new GetUsers(pageNumber, pageSize));
  }

  dispatchGetAdmins(pageNumber: number, pageSize: number) {
    this.store.dispatch(new GetAdmins(pageNumber, pageSize));
  }
  dispatchGetUsersBySearch(
    search: string,
    pageNumber: number,
    pageSize: number
  ) {
    this.store.dispatch(new GetUsersBySearch(search, pageNumber, pageSize));
  }

  dispatchGetUsersByRoleId(
    roleId: string,
    pageNumber: number,
    pageSize: number
  ) {
    this.store.dispatch(new GetUsersByRoleId(roleId, pageNumber, pageSize));
  }

  dispatchGetUsersByMultipleRoleIds(
    roleIds: string[],
    pageNumber?: number,
    pageSize?: number
  ) {
    this.store.dispatch(
      new GetUsersByMultipleRoleIds(roleIds, pageNumber, pageSize)
    );
  }

  dispatchUpdateUser(id: string, user: User) {
    this.store.dispatch(new UpdateUser(id, user));
  }

  dispatchUpdateUserRole(id: string, roleId: string) {
    this.store.dispatch(new UpdateUserRole(id, roleId));
  }

  dispatchDeleteUser(id: string) {
    this.store.dispatch(new DeleteUser(id));
  }

  dispatchForgetPassword(forgetPassword: ForgetPasswordRequest) {
    this.store.dispatch(new ForgetPassword(forgetPassword));
  }

  dispatchResetForgetPasswordStatus() {
    this.store.dispatch(new ResetForgetPasswordStatus());
  }

  dispatchResetPassword(resetPasswoerd: ResetPasswordRequest) {
    this.store.dispatch(new ResetPassword(resetPasswoerd));
  }
  dispatchResetResetPasswordStatus() {
    this.store.dispatch(new ResetResetPasswordStatus());
  }
  dispatchToggleStatus(id?: string) {
    this.store.dispatch(new ToggleStatus(id));
  }

  dispatchChangePassword(changePassword: ChangePasswordRequest) {
    this.store.dispatch(new ChangePassword(changePassword));
  }

  dispatchResetChangePasswordStatus() {
    this.store.dispatch(new ResetChangePasswordStatus());
  }

  dispachGetUsersByRolesAndOffices(roleIds: string[], officeIds: string[]) {
    this.store.dispatch(new GetUsersByRolesAndOffices(roleIds, officeIds));
  }

  dispachSetFilterdUsersEmpty() {
    this.store.dispatch(new SetFilterdUsersEmpty());
  }

  dispatchGetApprovers(
    roleIds: string[],
    pageNumber?: number,
    pageSize?: number
  ) {
    this.store.dispatch(new GetApprovers(roleIds, pageNumber, pageSize));
  }

  dispatchGetEvaluators(
    roleIds: string[],
    pageNumber?: number,
    pageSize?: number
  ) {
    this.store.dispatch(new GetEvaluators(roleIds, pageNumber, pageSize));
  }

  dispatchSetApproversAndEvaluatorsEmpty() {
    this.store.dispatch(new SetApproversAndEvaluatorsEmpty());
  }
}
