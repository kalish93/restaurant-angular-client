import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { RxState } from '@rx-angular/state';
import { RoleFacade } from 'src/app/users/facade/role.facade';
import { Role } from 'src/app/users/models/role.model';
interface AddRestaurantStaffComponentState {
  roles: Role[];
}

const initAddRestaurantStaffComponentState: Partial<AddRestaurantStaffComponentState> = {
  roles: [],
};
@Component({
  selector: 'app-add-restaurant-staff',
  templateUrl: './add-restaurant-staff.component.html',
  styleUrls: ['./add-restaurant-staff.component.scss'],
  providers:[RxState]
})
export class AddRestaurantStaffComponent implements OnInit {
  staffForm: FormGroup;

  $roles = this.state.select('roles');
  roles: Role[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddRestaurantStaffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private restaurantFacade: RestaurantFacade,
    private state: RxState<AddRestaurantStaffComponentState>,
    private roleFacade: RoleFacade
  ) {
    this.state.set(initAddRestaurantStaffComponentState);
    this.state.connect('roles', this.roleFacade.roles$)
    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      roleId: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.roleFacade.dispatchGetRoles();
    this.$roles.subscribe((data)=>{
      this.roles = data;
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
      this.restaurantFacade.dispatchAddRestaurantStaff({
        ...this.staffForm.value,
        restaurantId: this.data.restaurantId
      });
      this.dialogRef.close();
    }
  }
}
