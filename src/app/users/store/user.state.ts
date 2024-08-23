import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import {
  insertItem,
  patch,
  removeItem,
  updateItem,
} from '@ngxs/store/operators';
import { tap } from 'rxjs';
import { OperationStatusService } from 'src/app/core/services/operation-status/operation-status.service';
import { successStyle } from 'src/app/core/services/operation-status/status-style-names';

import { User } from '../models/user.model';
import { UsersService } from '../services/users.service';
import {
  DeleteUser,
  GetUsers,
  GetUsersByRoleId,
  GetUsersBySearch,
  RegisterUser,
  SelectUser,
  UpdateUser,
  ForgetPassword,
  ResetForgetPasswordStatus,
  ResetPassword,
  ResetResetPasswordStatus,
  ToggleStatus,
  GetAdmins,
  UpdateUserRole,
  ChangePassword,
  ResetChangePasswordStatus,
  GetUsersByRolesAndOffices,
  SetFilterdUsersEmpty,
  GetUsersByMultipleRoleIds,
  GetApprovers,
  GetEvaluators,
  SetApproversAndEvaluatorsEmpty,
} from './user.actions';
import {
  SetProgressOff,
  SetProgressOn,
} from 'src/app/core/store/progress-status.actions';

export interface UserStateModel {
  users: User[];
  selectedUser: User | null;
  isForgetPasswordSuccessful: boolean;
  isResetPasswordSuccessful: boolean;
  isChangePasswordSuccessful: boolean;
  filterdUsers: User[];
  filteredUsersByMultipleRoles: User[];
  approvers: User[];
  evaluators: User[];
}

const USER_STATE_TOKEN = new StateToken<UserStateModel>('usersState');

const defaults = {
  users: [],
  selectedUser: null,
  isForgetPasswordSuccessful: false,
  isResetPasswordSuccessful: false,
  isChangePasswordSuccessful: false,
  filterdUsers: [],
  filteredUsersByMultipleRoles: [],
  approvers: [],
  evaluators: [],
};

@State<UserStateModel>({
  name: USER_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class UserState {
  constructor(
    private usersService: UsersService,
    private operationStatus: OperationStatusService,
    private store: Store
  ) {}

  @Action(GetUsers)
  getUsers(
    { setState }: StateContext<UserStateModel>,
    { pageNumber, pageSize }: GetUsers
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.usersService.getUsers(pageNumber, pageSize).pipe(
      tap((users) => {
        setState(
          patch({
            users: users.items,
          })
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(GetUsersByRoleId)
  getUsersByRoleId(
    { setState }: StateContext<UserStateModel>,
    { roleId, pageNumber, pageSize }: GetUsersByRoleId
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.usersService
      .getUsersByRoleId(roleId, pageNumber, pageSize)
      .pipe(
        tap((users) => {
          setState(
            patch({
              users: users.items,
            })
          );
          this.store.dispatch(new SetProgressOff());
        })
      );
  }

  @Action(GetUsersBySearch)
  getUsersBySearch(
    { setState }: StateContext<UserStateModel>,
    { search, pageNumber, pageSize }: GetUsersBySearch
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.usersService
      .getUsersBySearch(search, pageNumber, pageSize)
      .pipe(
        tap((users) => {
          setState(
            patch({
              users: users.items,
            })
          );
          this.store.dispatch(new SetProgressOff());
        })
      );
  }

  @Action(RegisterUser)
  registerUser(
    { setState }: StateContext<UserStateModel>,
    { user }: RegisterUser
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.usersService.registerUser(user).pipe(
      tap((u) => {
        setState(
          patch({
            users: insertItem<User>(u),
          })
        );
        this.operationStatus.displayStatus(
          'User has been registered',
          successStyle
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(SelectUser)
  selectUser(
    { patchState }: StateContext<UserStateModel>,
    { user }: SelectUser
  ) {
    patchState({ selectedUser: user });
  }

  @Action(UpdateUser)
  updateUser(
    { setState }: StateContext<UserStateModel>,
    { id, user }: UpdateUser
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.usersService.updateUser(id, user).pipe(
      tap((updatedUser) => {
        setState(
          patch({
            users: updateItem<User>((u) => u?.id === id, { ...updatedUser }),
          })
        );
        this.operationStatus.displayStatus(
          'User has been updated',
          successStyle
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(UpdateUserRole)
  updateUserRole(
    { setState }: StateContext<UserStateModel>,
    { id, roleId }: UpdateUserRole
  ) {
    this.store.dispatch(new SetProgressOn());
    return this.usersService.updateUserRole(id, roleId).pipe(
      tap((updatedUser) => {
        setState(
          patch({
            users: removeItem<User>((u) => u?.id === id),
          })
        );
        this.operationStatus.displayStatus(
          'User role has been updated',
          successStyle
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(DeleteUser)
  deleteUser({ setState }: StateContext<UserStateModel>, { id }: DeleteUser) {
    this.store.dispatch(new SetProgressOn());
    return this.usersService.deleteUser(id).pipe(
      tap((_) => {
        setState(
          patch({
            users: removeItem<User>((u) => u?.id === id),
          })
        );
        this.operationStatus.displayStatus(
          'User has been deleted',
          successStyle
        );
        this.store.dispatch(new SetProgressOff());
      })
    );
  }

  @Action(ForgetPassword)
  forgotPassword(
    { setState }: StateContext<UserStateModel>,
    { forgetPassword }: ForgetPassword
  ) {
    return this.usersService.forgetPassword(forgetPassword).pipe(
      tap((result) => {
        setState(
          patch({
            isForgetPasswordSuccessful: result,
          })
        );
        this.operationStatus.displayStatus(
          "We've sent a password reset link to your email. Please check your inbox and follow the instructions to reset your password",
          successStyle
        );
      })
    );
  }

  @Action(ResetForgetPasswordStatus)
  resetForgetPasswordStatus({ setState }: StateContext<UserStateModel>) {
    setState(
      patch({
        isForgetPasswordSuccessful: false,
      })
    );
  }

  @Action(ResetPassword)
  resetPassword(
    { setState }: StateContext<UserStateModel>,
    { resetPassword }: ResetPassword
  ) {
    return this.usersService.resetPassword(resetPassword).pipe(
      tap((_) => {
        setState(
          patch({
            isResetPasswordSuccessful: true,
          })
        );
        this.operationStatus.displayStatus(
          'your password is successfully reset',
          successStyle
        );
      })
    );
  }

  @Action(ResetResetPasswordStatus)
  resetResetPasswordStatus({ setState }: StateContext<UserStateModel>) {
    setState(
      patch({
        isResetPasswordSuccessful: false,
      })
    );
  }
  @Action(GetAdmins)
  getAdmins(
    { setState }: StateContext<UserStateModel>,
    { pageNumber, pageSize }: GetAdmins
  ) {
    return this.usersService.getAdmins(pageNumber, pageSize).pipe(
      tap((users) => {
        setState(
          patch({
            users: users.items,
          })
        );
      })
    );
  }
  @Action(ToggleStatus)
  toggleStatus(
    { setState }: StateContext<UserStateModel>,
    { id }: ToggleStatus
  ) {
    return this.usersService.toggleStatus(id).pipe(
      tap((user) => {
        setState(
          patch({
            users: updateItem<User>((u) => u?.id === id, { ...user }),
          })
        );
        this.operationStatus.displayStatus(
          'User status has been updated',
          successStyle
        );
      })
    );
  }

  @Action(ChangePassword)
  changePassword(
    { setState }: StateContext<UserStateModel>,
    { changePassword }: ChangePassword
  ) {
    return this.usersService.changePassword(changePassword).pipe(
      tap((_) => {
        setState(
          patch({
            isChangePasswordSuccessful: true,
          })
        );
        this.operationStatus.displayStatus(
          'password change successfully',
          successStyle
        );
      })
    );
  }

  @Action(ResetChangePasswordStatus)
  resetChangePasswordStatus({ setState }: StateContext<UserStateModel>) {
    setState(
      patch({
        isChangePasswordSuccessful: false,
      })
    );
  }

  @Action(GetUsersByRolesAndOffices)
  getUsersByRolesAndOffices(
    { setState }: StateContext<UserStateModel>,
    { roleIds, officeIds }: GetUsersByRolesAndOffices
  ) {
    return this.usersService.getUsersByRolesAndOffices(roleIds, officeIds).pipe(
      tap((users) => {
        setState(
          patch({
            filterdUsers: users,
          })
        );
      })
    );
  }
  @Action(GetUsersByMultipleRoleIds)
  getUsersByMultipleRoleIds(
    { setState }: StateContext<UserStateModel>,
    { roleIds, pageNumber, pageSize }: GetUsersByMultipleRoleIds
  ) {
    return this.usersService
      .getUsersByMultipleRoleIds(roleIds, pageNumber, pageSize)
      .pipe(
        tap((users) => {
          setState(
            patch({
              filteredUsersByMultipleRoles: users,
            })
          );
        })
      );
  }
  @Action(SetFilterdUsersEmpty)
  setFilterdUsersEmpty(
    { patchState }: StateContext<UserStateModel>,
    {}: SetFilterdUsersEmpty
  ) {
    patchState({ filterdUsers: [] });
  }

  @Action(GetApprovers)
  getApprovers(
    { setState }: StateContext<UserStateModel>,
    { roleIds, pageNumber, pageSize }: GetApprovers
  ) {
    return this.usersService
      .getUsersByMultipleRoleIds(roleIds, pageNumber, pageSize)
      .pipe(
        tap((users) => {
          setState(
            patch({
              approvers: users,
            })
          );
        })
      );
  }

  @Action(GetEvaluators)
  getEvaluators(
    { setState }: StateContext<UserStateModel>,
    { roleIds, pageNumber, pageSize }: GetEvaluators
  ) {
    return this.usersService
      .getUsersByMultipleRoleIds(roleIds, pageNumber, pageSize)
      .pipe(
        tap((users) => {
          setState(
            patch({
              evaluators: users,
            })
          );
        })
      );
  }

  @Action(SetApproversAndEvaluatorsEmpty)
  setApproversAndEvaluatorsEmpty(
    { patchState }: StateContext<UserStateModel>,
    {}: SetApproversAndEvaluatorsEmpty
  ) {
    patchState({
      approvers: [],
      evaluators: [],
    });
  }
}
