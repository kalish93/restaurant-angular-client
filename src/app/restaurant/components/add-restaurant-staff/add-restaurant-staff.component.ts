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
  isEditMode: boolean = false;
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
    // this.staffForm = this.fb.group({
    //   firstName: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   password: ['', Validators.required],
    //   passwordConfirmation: ['', Validators.required],
    //   roleId: ['', Validators.required]
    // }, { validators: this.passwordMatchValidator });

    this.isEditMode = !!data.user; // Check if we're editing based on provided data

    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roleId: ['', Validators.required]
    });

    // Add password fields only if not in edit mode
    if (!this.isEditMode) {
       this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
      roleId: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    }
  }

  ngOnInit(): void {

    if (this.data.user) {
      this.staffForm.patchValue({
        firstName: this.data.user.firstName,
        lastName: this.data.user.lastName,
        email: this.data.user.email,
        roleId: this.data.user.role.id,
      });
      // Remove password validation if in edit mode
      this.staffForm.get('password')?.clearValidators();
      this.staffForm.get('passwordConfirmation')?.clearValidators();
      this.staffForm.get('password')?.updateValueAndValidity();
      this.staffForm.get('passwordConfirmation')?.updateValueAndValidity();
    }

    this.roleFacade.dispatchGetRoles();
    this.$roles.subscribe((data)=>{
      this.roles = data.filter((role) => role.name !== 'Admin')
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
      if(this.data.user){
        this.restaurantFacade.dispatchUpdateRestaurantStaff(this.staffForm.value, this.data.user.id)
      }else{
      this.restaurantFacade.dispatchAddRestaurantStaff({
        ...this.staffForm.value,
        restaurantId: this.data.restaurantId
      });
    }
      this.dialogRef.close();
    }
  }
}
