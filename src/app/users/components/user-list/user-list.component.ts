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

interface UserListComponentState {
  users: User[];
}

interface RoleListComponentState {
  roles: Role[];
}

interface Role {
  id: string;
  name: string;
}

const initUserListComponentState: Partial<UserListComponentState> = {
  users: [],
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
  dataset!: User[];
  registrationType?: RegistrationType = RegistrationType.ADMIN;

  users$: Observable<User[]> = this.state.select('users');
  roles$: Observable<Role[]> = this.roleState.select('roles');

  roles: Role[] = [];
  selectedRoleId: string = '';

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

    this.prepareGrid();

    this.users$.subscribe((users) => (this.dataset = users));
    this.roles$.subscribe((roles) => (this.roles = roles));

    this.route.data.subscribe((data) => {
      this.registrationType = data['registrationType'];
    });
  }

  prepareGrid() {
    this.columnDefinitions = [
      {
        id: 'edit',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters['editIcon'],
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.editUser(args.dataContext);
        },
      },
      {
        id: 'delete',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
        excludeFromHeaderMenu: true,
        formatter: Formatters['deleteIcon'],
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.deleteUser(args.dataContext);
        },
      },
      {
        id: 'userName',
        name: 'User Name',
        field: 'userName',
        sortable: true,
      },
      {
        id: 'email',
        name: 'Email',
        field: 'email',
        sortable: true,
      },

      {
        id: 'phoneNumber',
        name: 'Phone Number',
        field: 'phoneNumber',
        sortable: true,
      },
      {
        id: 'role',
        name: 'Role',
        field: 'role',
        sortable: true,
      },
      {
        id: 'action',
        name: 'Action',
        field: 'action',
        formatter: () =>
          this.selectedRoleId
            ? `<button>Invoke | Revoke</button>`
            : `<button disabled>Invoke | Revoke</button>`,
        sortable: true,
        onCellClick: (e: Event, args: OnEventArgs) => {
          this.changeRole(args.dataContext);
        },
      },
    ];

    this.gridOptions = {
      enableAutoResize: true,
      enableSorting: true,
      enableGrouping: true,
      gridHeight: 450,
      gridWidth: '100%',
      enableCellNavigation: true,
      enableRowSelection: true,
      editable: false,
      multiSelect: false,
      rowSelectionOptions: {
        selectActiveRow: true,
      },
      enableGridMenu: false,
      enableHeaderMenu: false,
      enableContextMenu: false,
      enableCellMenu: false,

      // disable the default resizing option
      autoFitColumnsOnFirstLoad: false,
      enableAutoSizeColumns: false,

      // enable resize by content
      autosizeColumnsByCellContentOnFirstLoad: true,
      enableAutoResizeColumnsByCellContent: true,

      resizeByContentOptions: {
        cellCharWidthInPx: 11,
      },

      enableFiltering: true,
    };
  }

  buttonTitle() {
    return this.registrationType === RegistrationType.ADMIN
      ? 'Add User'
      : this.registrationType === RegistrationType.EMPLOYEE
      ? 'Add Employee'
      : 'Add User';
  }

  onRoleChange(event: any) {
    this.selectedRoleId = event.value;
    this.userFacade.dispatchGetUsersByRoleId(
      this.selectedRoleId,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize || 10
    );
  }

  changeRole(user: User) {
    this.userFacade.dispatchSelectUser(user);
    this.matDialog.open(ChangeRoleComponent, {
      data: {
        update: true,
        roleId: this.selectedRoleId,
        roles: this.roles,
      },
      disableClose: true,
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
    this.matDialog.open(UserFormComponent, {
      data: { update: false, registrationType: this.registrationType },
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
