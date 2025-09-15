import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestaurantFacade } from '../../facades/restaurant.facade';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrls: ['./restaurant-form.component.scss']
})
export class RestaurantFormComponent {
  addRestaurantForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RestaurantFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restaurantFacade: RestaurantFacade
  ) {
    this.addRestaurantForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: [''],
      address: [''],
      subscription: ['BASIC'],
      logo: [null]
    });

    if (data.restaurant) {
      this.addRestaurantForm.patchValue({
        name: data.restaurant.name,
        phone: data.restaurant.phone,
        address: data.restaurant.address,
        subscription: data.restaurant.subscription
      });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.addRestaurantForm.patchValue({ logo: file });
      this.addRestaurantForm.get('logo')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.addRestaurantForm.valid) {
      const formData = new FormData();
      formData.append('name', this.addRestaurantForm.value.name);
      formData.append('phone', this.addRestaurantForm.value.phone);
      formData.append('address', this.addRestaurantForm.value.address);
      formData.append('subscription', this.addRestaurantForm.value.subscription);

      if (this.addRestaurantForm.value.logo) {
        formData.append('image', this.addRestaurantForm.value.logo);
      }

      if (this.data.restaurant) {
        formData.append('id', this.data.restaurant.id);
        this.restaurantFacade.dispatchUpdateRestaurant(this.data.restaurant.id, formData);
      } else {
        this.restaurantFacade.dispatchCreateRestaurant(formData);
      }

      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
