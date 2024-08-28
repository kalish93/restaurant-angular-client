import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RxState } from '@rx-angular/state';
import {
  AngularGridInstance,
  Column,
  Formatters,
  GridOption,
  OnEventArgs,
} from 'angular-slickgrid';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { UserFacade } from '../../facade/user.facade';
import { User } from '../../models/user.model';
import {
  RegistrationType,
  UserFormComponent,
} from '../user-form/user-form.component';
import { RoleFacade } from '../../facade/role.facade';
import { ChangeRoleComponent } from '../change-role/change-role.component';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';
import { AddAdminFormComponent } from '../add-admin-form/add-admin-form.component';

interface UserListComponentState {
  users: any;
}

interface RoleListComponentState {
  roles: Role[];
}

interface Role {
  id: string;
  name: string;
}

const initUserListComponentState: Partial<UserListComponentState> = {
  users: undefined,
};

const initRoleListComponentState: Partial<RoleListComponentState> = {
  roles: [],
};

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [RxState],
})
export class UserListComponent implements OnInit {
  columnDefinitions: Column[] = [];
  gridOptions!: GridOption;
  angularGrid!: AngularGridInstance;
  dataset: any[] = [];

  registrationType?: RegistrationType = RegistrationType.ADMIN;

  users$ = this.state.select('users');
  roles$: Observable<Role[]> = this.roleState.select('roles');

  roles: Role[] = [];
  selectedRoleId: string = '';
  displayedColumns: string[] = ['name', 'email', 'restaurant', 'role'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  length: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  constructor(
    private matDialog: MatDialog,
    private userFacade: UserFacade,
    private roleFacade: RoleFacade,
    private state: RxState<UserListComponentState>,
    private roleState: RxState<RoleListComponentState>,
    private route: ActivatedRoute
  ) {
    this.state.set(initUserListComponentState);
    this.state.connect('users', userFacade.users$);
    this.roleState.set(initRoleListComponentState);
    this.roleState.connect('roles', roleFacade.roles$);
  }

  searchText: string = '';

  ngOnInit(): void {
    this.userFacade.dispatchGetUsers(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize || 10
    );

    this.roleFacade.dispatchGetRoles();


    this.users$.subscribe((users) => {
      this.dataset = users?.items;
      // this.pageNumber = users?.pageNumber;
      this.paginator.length = users?.totalCount as any;

    });
    this.roles$.subscribe((roles) => (this.roles = roles));

    this.route.data.subscribe((data) => {
      this.registrationType = data['registrationType'];
    });
  }

  getUsersBySearch() {
    if (this.searchText) {
      this.userFacade.dispatchGetUsersBySearch(
        this.searchText,
        this.paginator.pageIndex + 1,
        this.paginator.pageSize || 10
      );
    } else {
      this.userFacade.dispatchGetUsers(
        this.paginator.pageIndex + 1,
        this.paginator.pageSize || 10
      );
    }
  }

  addUser() {
    this.matDialog.open(AddAdminFormComponent, {
          width: '400px',
          disableClose: true,
    });
  }

  editUser(user: User) {
    this.userFacade.dispatchSelectUser(user);
    this.matDialog.open(UserFormComponent, {
      data: { update: true, registrationType: this.registrationType },
      disableClose: true,
    });
  }

  deleteUser(user: User) {
    this.matDialog.open(ConfirmDialogComponent, {
      disableClose: true,
    });
  }

  angularGridReady(event: Event) {
    const angularGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.angularGrid = angularGrid;
  }

  loadPaginatedUsers(event: PageEvent) {
    this.userFacade.dispatchGetUsers(event.pageIndex + 1, event.pageSize);
  }
}
