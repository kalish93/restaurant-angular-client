import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';

@Component({
  selector: 'app-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrl: './discount-form.component.scss'
})
export class DiscountFormComponent {
  name: string = '';
  percentage: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DiscountFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public restauarntFacade: RestaurantFacade
  ) {}

  onConfirm(): void {
    const dataToSend = {
      restaurantId: this.data.restaurantId,
      name: this.name,
      percentage: this.percentage
    }

    this.restauarntFacade.dispatchCreateDiscount(dataToSend);
    this.dialogRef.close()
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
