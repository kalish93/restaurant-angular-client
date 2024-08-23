import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { UserFacade } from '../../facade/user.facade';
import { User } from '../../models/user.model';
import { RoleFacade } from '../../facade/role.facade';
import { Role } from '../../models/role.model';

export enum RegistrationType {
  EMPLOYEE = 'Employee',
  USER = 'User',
  ADMIN = 'Admin',
}

export interface ValidationResult {
  [key: string]: boolean;
}

interface SelectedUserComponentState {
  selectedUser: User | null;
}

interface RoleListComponentState {
  roles: Role[];
}

const initSelectedUserComponentState: Partial<SelectedUserComponentState> = {
  selectedUser: null,
};

const initRoleListComponentState: Partial<RoleListComponentState> = {
  roles: [],
};

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  providers: [RxState],
})
export class UserFormComponent implements OnInit {
  update = false;
  registrationType?: RegistrationType = RegistrationType.USER;

  userForm: FormGroup;

  selectedUser$: Observable<User | null> = this.state.select('selectedUser');

  roles$: Observable<Role[]> = this.roleState.select('roles');

  roles: Role[] = [];

  maxBirthDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      update: boolean;
      registrationType?: RegistrationType;
    },
    private userFacade: UserFacade,
    private roleFacade: RoleFacade,
    private state: RxState<SelectedUserComponentState>,
    private roleState: RxState<RoleListComponentState>
  ) {
    this.state.set(initSelectedUserComponentState);
    this.roleState.set(initRoleListComponentState);
    this.state.connect('selectedUser', userFacade.selectedUser$);
    this.roleState.connect('roles', roleFacade.roles$);
    this.update = this.data.update;
    this.registrationType = this.data.registrationType || RegistrationType.USER;

    const today = new Date();
    this.maxBirthDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    this.userForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern('^[a-zA-Z ]*$'),
        ],
      ],
      middleName: [
        '',
        [Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      lastName: [
        '',
        [Validators.minLength(3), Validators.pattern('^[a-zA-Z ]*$')],
      ],
      userName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&/])[A-Za-z\d@$!%*#?&/]{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^(9|7)[0-9]{8}$/)],
      ],
      roleId: ['', this.isAdminRegistration() && Validators.required],
      dateOfBirth: null,
    });
  }

  ngOnInit(): void {
    this.roleFacade.dispatchGetRoles();

    this.roles$.subscribe((roles) => (this.roles = roles));
  }

  isUserRegistration(): boolean {
    return this.registrationType === RegistrationType.USER;
  }

  isAdminRegistration(): boolean {
    return this.registrationType === RegistrationType.ADMIN;
  }

  getRole(): String {
    switch (this.registrationType) {
      case RegistrationType.USER:
        return this.roles.find((role) => role.name === RegistrationType.USER)!
          .id!;

      case RegistrationType.EMPLOYEE:
        return this.roles.find(
          (role) => role.name === RegistrationType.EMPLOYEE
        )!.id!;
      default:
        return '';
    }
  }

  save() {
    const { valid, touched, dirty } = this.userForm;
    if (valid && (touched || dirty)) {
      if (!this.update) {
        const user: User = {
          ...this.userForm.value,

          roleId: !this.isAdminRegistration()
            ? this.getRole()
            : this.userForm.value.roleId,
        };

        this.userFacade.dispatchRegisterUser(user);
      }

      if (this.update) {
        const userUpdate: User = {
          ...this.userForm.value,
        };

        this.selectedUser$.subscribe((user) => {
          if (user && user.id) {
            this.userFacade.dispatchUpdateUser(user.id, userUpdate);
          }
        });
      }
    }
  }
}
