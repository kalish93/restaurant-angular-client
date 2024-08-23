import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestaurantFacade } from '../../facades/restaurant.facade';

@Component({
  selector: 'app-restaurant-form',
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.scss'
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
      name: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onSubmit(): void {
    if (this.addRestaurantForm.valid) {
      const newRestaurant = {
        name: this.addRestaurantForm.value.name,
      };

      this.restaurantFacade.dispatchCreateRestaurant(newRestaurant);
      this.dialogRef.close(newRestaurant);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
