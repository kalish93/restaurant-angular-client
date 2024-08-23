import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserFacade } from '../../facade/user.facade';
import { RxState } from '@rx-angular/state';
import { Role } from '../../models/role.model';

interface SelectedUserComponentState {
  selectedUser: User | null;
}

const initSelectedUserComponentState: Partial<SelectedUserComponentState> = {
  selectedUser: null,
};

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.scss'],
  providers: [RxState],
})
export class ChangeRoleComponent implements OnInit {
  update = false;
  roleId = '';

  roleForm: FormGroup;

  selectedUser$: Observable<User | null> = this.state.select('selectedUser');

  roles: Role[] = [];

  filteredRoles: Role[] = [];
  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      update: boolean;
      roleId: string;
      roles: Role[];
    },
    private userFacade: UserFacade,
    private state: RxState<SelectedUserComponentState> // private roleState: RxState<RoleListComponentState>
  ) {
    this.state.set(initSelectedUserComponentState);
    this.state.connect('selectedUser', userFacade.selectedUser$);

    this.roleId = this.data.roleId;
    this.update = this.data.update;

    this.filteredRoles = this.data.roles.filter(
      (role) => role.id !== this.roleId
    );

    this.roleForm = this.fb.group({
      newRole: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.selectedUser$.subscribe((user) => {
      if (user && user.id) {
        this.user = user;
      }
    });
  }

  save() {
    const { valid, touched, dirty } = this.roleForm;
    if (valid && (touched || dirty)) {
      if (this.update) {
        const roleUpdate: Role = {
          ...this.roleForm.value,
          id: this.roleForm.value.newRole,
        };

        this.selectedUser$.subscribe((user) => {
          if (user && user.id) {
            this.userFacade.dispatchUpdateUserRole(user.id, roleUpdate.id);
          }
        });
      }
    }
  }
}
