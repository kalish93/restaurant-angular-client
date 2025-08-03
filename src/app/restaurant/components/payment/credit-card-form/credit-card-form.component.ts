import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';

@Component({
    selector: 'app-credit-card-form',
    templateUrl: './credit-card-form.component.html',
    styleUrl: './credit-card-form.component.scss',
    standalone: false
})
export class CreditCardFormComponent {
  name: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreditCardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public restauarntFacade: RestaurantFacade
  ) {}

  onConfirm(): void {
    const dataToSend = {
      restaurantId: this.data.restaurantId,
      name: this.name
    }

    this.restauarntFacade.dispatchCreateCreditCard(dataToSend);
    this.dialogRef.close()
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
