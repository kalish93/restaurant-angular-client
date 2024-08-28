import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { UserFacade } from '../../facade/user.facade';
import { User } from '../../models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';

interface AdminListComponentState {
  admins: User[];
}

const initAdminListComponentState: Partial<AdminListComponentState> = {
  admins: [],
};

@Component({
  selector: 'app-user-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
  providers: [RxState],
})
export class AdminListComponent {
  // selctionChoice: string[] = ['Active', 'Suspended', 'Both'];
  // columnDefinitions: Column[] = [];
  // gridOptions!: GridOption;
  // angularGrid!: AngularGridInstance;
  // dataset!: User[];

  // users$: Observable<User[]> = this.state.select('admins');

  // @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  // length: number = 0;
  // pageSize: number = 10;
  // pageIndex: number = 0;

  // constructor(
  //   private matDialog: MatDialog,
  //   private userFacade: UserFacade,
  //   private state: RxState<AdminListComponentState>
  // ) {
  //   this.state.set(initAdminListComponentState);
  //   this.state.connect('admins', userFacade.users$);
  // }

  // ngOnInit(): void {
  //   this.userFacade.dispatchGetAdmins(
  //     this.paginator.pageIndex + 1,
  //     this.paginator.pageSize || 10
  //   );

  //   this.prepareGrid();

  //   this.users$.subscribe((users) => (this.dataset = users));
  // }

  // prepareGrid() {
  //   this.columnDefinitions = [
  //     {
  //       id: 'edit',
  //       field: 'id',
  //       excludeFromHeaderMenu: true,
  //       formatter: Formatters['editIcon'],
  //       minWidth: 30,
  //       maxWidth: 30,
  //       onCellClick: (e: Event, args: OnEventArgs) => {
  //         this.editUser(args.dataContext);
  //       },
  //     },
  //     {
  //       id: 'delete',
  //       field: 'id',
  //       excludeFromColumnPicker: true,
  //       excludeFromGridMenu: true,
  //       excludeFromHeaderMenu: true,
  //       formatter: Formatters['deleteIcon'],
  //       minWidth: 30,
  //       maxWidth: 30,
  //       onCellClick: (e: Event, args: OnEventArgs) => {
  //         this.deleteUser(args.dataContext);
  //       },
  //     },
  //     {
  //       id: 'userName',
  //       name: 'User Name',
  //       field: 'userName',
  //       sortable: true,
  //     },
  //     {
  //       id: 'email',
  //       name: 'Email',
  //       field: 'email',
  //       sortable: true,
  //     },

  //     {
  //       id: 'phoneNumber',
  //       name: 'Phone Number',
  //       field: 'phoneNumber',
  //       sortable: true,
  //     },

  //     {
  //       id: 'isActive',
  //       field: 'isActive',
  //       formatter: (row, cell, value, columnDef, dataContext) => {
  //         return value === true
  //           ? '<button mat-button color="warn">Susepend</button>'
  //           : '<button mat-button color="primary">Activate</button>';
  //       },
  //       onCellClick: (e: Event, args: OnEventArgs) => {
  //         this.toggleStatus(args.dataContext.id);
  //       },
  //     },
  //   ];

  //   this.gridOptions = {
  //     enableAutoResize: true,
  //     enableSorting: true,
  //     enableGrouping: true,
  //     gridHeight: 450,
  //     gridWidth: '100%',
  //     enableCellNavigation: true,
  //     enableRowSelection: true,
  //     editable: false,
  //     multiSelect: false,
  //     rowSelectionOptions: {
  //       selectActiveRow: true,
  //     },
  //     enableGridMenu: false,
  //     enableHeaderMenu: false,
  //     enableContextMenu: false,
  //     enableCellMenu: false,

  //     // disable the default resizing option
  //     autoFitColumnsOnFirstLoad: false,
  //     enableAutoSizeColumns: false,
  //     // enable resize by content
  //     autosizeColumnsByCellContentOnFirstLoad: true,
  //     enableAutoResizeColumnsByCellContent: true,

  //     resizeByContentOptions: {
  //       cellCharWidthInPx: 11,
  //     },

  //     enableFiltering: true,
  //   };
  // }

  // addUser() {
  //   this.matDialog.open(UserFormComponent, {
  //     data: { update: false },
  //     disableClose: true,
  //   });
  // }

  // editUser(user: User) {
  //   this.userFacade.dispatchSelectUser(user);
  //   this.matDialog.open(UserFormComponent, {
  //     data: { update: true },
  //     disableClose: true,
  //   });
  // }

  // deleteUser(user: User) {
  //   this.matDialog.open(ConfirmDialogComponent, {
  //     disableClose: true,
  //   });
  // }
  // toggleStatus(id: string) {
  //   this.userFacade.dispatchToggleStatus(id);
  // }

  // angularGridReady(event: Event) {
  //   const angularGrid = (event as CustomEvent).detail as AngularGridInstance;
  //   this.angularGrid = angularGrid;
  // }

  // loadPaginatedUsers(event: PageEvent) {
  //   this.userFacade.dispatchGetAdmins(event.pageIndex + 1, event.pageSize);
  // }

  // onChoiceChange(event: any) {
  //   if (event.value === 'Both') this.dataset = this.state.get().admins;
  //   if (event.value === 'Active')
  //     this.dataset = this.state
  //       .get()
  //       .admins.filter((admin) => admin.isActive === true);
  //   if (event.value === 'Suspended')
  //     this.dataset = this.state
  //       .get()
  //       .admins.filter((admin) => admin.isActive === false);
  // }
}
