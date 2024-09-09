import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';
import { HomeComponent } from './components/home/home.component';
import { UserListComponent } from './components/user-list/user-list.component';

import { NgxsModule } from '@ngxs/store';
import { UserState } from './store/user.state';

import { ChangePasswordComponent } from './components/change-password/change-password.component';

import { RoleState } from './store/role.state';

import { FormsModule } from '@angular/forms';
import { AddAdminFormComponent } from './components/add-admin-form/add-admin-form.component';

@NgModule({
  declarations: [
    HomeComponent,
    UserListComponent,
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
