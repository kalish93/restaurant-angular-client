import { Component, Inject } from '@angular/core';
import { Role } from '../../models/role.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { RoleFacade } from '../../facade/role.facade';
import { UserFacade } from '../../facade/user.facade';

interface AddRestaurantStaffComponentState {
  roles: Role[];
}

const initAddRestaurantStaffComponentState: Partial<AddRestaurantStaffComponentState> = {
  roles: [],
};

@Component({
    selector: 'app-add-admin-form',
    templateUrl: './add-admin-form.component.html',
    styleUrl: './add-admin-form.component.scss',
    providers: [RxState],
    standalone: false
})
export class AddAdminFormComponent {
  staffForm: FormGroup;

  $roles = this.state.select('roles');
  roles: Role[] = [];
  adminRole: any;

  constructor(
    public dialogRef: MatDialogRef<AddAdminFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private state: RxState<AddRestaurantStaffComponentState>,
    private roleFacade: RoleFacade,
    private userFacade: UserFacade
  ) {
    this.state.set(initAddRestaurantStaffComponentState);
    this.state.connect('roles', this.roleFacade.roles$)
    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.roleFacade.dispatchGetRoles();
    this.$roles.subscribe((data)=>{
      this.adminRole = data.find((role) => role.name === 'Admin')
    })
  }


  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    return form.get('password')?.value === form.get('passwordConfirmation')?.value
      ? null : { 'mismatch': true };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.staffForm.valid) {
      this.userFacade.dispatchRegisterUser({
        ...this.staffForm.value,
        roleId: this.adminRole.id
      });
      this.dialogRef.close();
    }
  }

}
