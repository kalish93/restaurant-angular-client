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
    if(data.restaurant){
      this.addRestaurantForm.get('name')?.setValue(data.restaurant.name);
    }
  }

  onSubmit(): void {
    if (this.addRestaurantForm.valid) {
      if(this.data.restaurant){
        const updated = {
          id: this.data.restaurant.id,
          name: this.addRestaurantForm.value.name,
        }
        this.restaurantFacade.dispatchUpdateRestaurant(updated);
      }else{
      const newRestaurant = {
        name: this.addRestaurantForm.value.name,
      };

      this.restaurantFacade.dispatchCreateRestaurant(newRestaurant);
    }
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
