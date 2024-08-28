import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { HomeComponent } from './components/home/home.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { RolesComponent } from './components/roles/roles.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { NgxsModule } from '@ngxs/store';
import { UserState } from './store/user.state';
import { RoleListComponent } from './components/role-list/role-list.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AdminListComponent } from './components/admin-list/admin-list.component';
import { RoleState } from './store/role.state';
import { ChangeRoleComponent } from './components/change-role/change-role.component';
import { FormsModule } from '@angular/forms';
import { AddAdminFormComponent } from './components/add-admin-form/add-admin-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    UserFormComponent,
    UserListComponent,
    RolesComponent,
    PermissionsComponent,
    RoleListComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    AdminListComponent,
    ChangeRoleComponent,
    ChangePasswordComponent,
    AddAdminFormComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule,
    NgxsModule.forFeature([UserState, RoleState]),
    FormsModule,
  ],
})
export class UsersModule {}
