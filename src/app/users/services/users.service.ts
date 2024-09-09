import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  FORGET_PASSWORD_URL,
  USERS_URL,
  RESET_PASSWORD_URL,
  ROLES_URL,
  CHANGE_PASSWORD_URL,
  API_BASE_URL,
} from 'src/app/core/constants/api-endpoints';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';
import { User } from '../models/user.model';
import { ForgetPasswordRequest } from '../models/forget-password-request.model';
import { ResetPasswordRequest } from '../models/reset-password-request.model';
import { ChangePasswordRequest } from '../models/change-password-request.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<any> {
    return this.http.post<any>(`${USERS_URL}`, user, this.httpOptions);
  }

  getUsers(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedList<User>> {
    return this.http.get<PaginatedList<User>>(
      `${USERS_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getUsersByRoleId(
    roleId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedList<User>> {
    return this.http.get<PaginatedList<User>>(
      `${ROLES_URL}/${roleId}/users?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getUsersByMultipleRoleIds(
    roleIds: string[],
    pageNumber?: number,
    pageSize?: number
  ): Observable<User[]> {
    const concatRoleIds = roleIds.join(',');
    if (pageNumber === undefined || pageSize === undefined) {
      return this.http.get<User[]>(
        `${USERS_URL}/multiple?roleIds=${concatRoleIds}`
      );
    }
    return this.http.get<User[]>(
      `${USERS_URL}/multiple?roleIds=${concatRoleIds}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  getUsersBySearch(
    search: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedList<User>> {
    return this.http.get<PaginatedList<User>>(
      `${USERS_URL}/search?search=${search}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(
      `${USERS_URL}?userId=${id}`,
      user,
      this.httpOptions
    );
  }

  updateUserRole(id: string, roleId: string): Observable<any> {
    return this.http.put<any>(
      `${USERS_URL}/${id}/roles/${roleId}`,
      this.httpOptions
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${USERS_URL}?userId=${id}`, this.httpOptions);
  }

  forgetPassword(forgetPassword: ForgetPasswordRequest): Observable<any> {
    return this.http.post<any>(
      `${FORGET_PASSWORD_URL}`,
      forgetPassword,
      this.httpOptions
    );
  }

  resetPassword(resetPassword: ResetPasswordRequest): Observable<any> {
    return this.http.post<any>(
      `${RESET_PASSWORD_URL}`,
      resetPassword,
      this.httpOptions
    );
  }

  getAdmins(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedList<User>> {
    return this.http.get<PaginatedList<User>>(
      `${USERS_URL}/admin-users?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  toggleStatus(id?: string): Observable<User> {
    return this.http.get<any>(`${USERS_URL}/${id}/activate`, this.httpOptions);
  }

  changePassword(changePassword: ChangePasswordRequest): Observable<any> {
    return this.http.put<any>(
      `${API_BASE_URL}/change-password`,
      changePassword,
      this.httpOptions
    );
  }

  getUsersByRolesAndOffices(
    roleIds: string[],
    officeIds: string[]
  ): Observable<User[]> {
    return this.http.post<User[]>(
      `${USERS_URL}/users-by-role-and-office`,
      { roleIds, officeIds },
      this.httpOptions
    );
  }
}
