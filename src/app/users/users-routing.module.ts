import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from './components/role-list/role-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {
  FORGET_PASSWORD_ROUTE,
  RESET_PASSWORD_ROUTE,
  ROLES_LIST,
  USERS_LIST,
  ADMINS_LIST,
  EMPLOYEES_LIST,
  CHANGE_PASSWORD_ROUTE,
  RESTAURANT_LIST,
} from '../core/constants/routes';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { RegistrationType } from './components/user-form/user-form.component';
import { HomeComponent } from './components/home/home.component';
import { RestaurantListComponent } from '../restaurant/components/restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from '../restaurant/components/restaurant-detail/restaurant-detail.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: RESTAURANT_LIST,
        component: RestaurantListComponent,
      },
      {
        path: `${RESTAURANT_LIST}/:id`,
        component: RestaurantDetailComponent,
      },
      {
        path: USERS_LIST,
        component: UserListComponent,
        data: { registrationType: RegistrationType.ADMIN },
      },
      { path: ROLES_LIST, component: RoleListComponent },
      { path: ADMINS_LIST, component: AdminListComponent },
      {
        path: EMPLOYEES_LIST,
        component: UserListComponent,
        data: { registrationType: RegistrationType.EMPLOYEE },
      },
    ],
  },
  {
    path: FORGET_PASSWORD_ROUTE,
    component: ForgetPasswordComponent,
  },

  {
    path: RESET_PASSWORD_ROUTE,
    component: ResetPasswordComponent,
  },
  {
    path: CHANGE_PASSWORD_ROUTE,
    component: ChangePasswordComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
