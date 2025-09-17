import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent {
  constructor(
    private dialogRef: MatDialogRef<CartModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { restaurantId: string; tableId: string }
  ) {}

  closeModal() {
    this.dialogRef.close();
  }
}
