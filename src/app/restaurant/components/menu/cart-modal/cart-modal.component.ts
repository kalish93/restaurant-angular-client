import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent {
  constructor(private dialogRef: MatDialogRef<CartModalComponent>) {}

  closeModal() {
    this.dialogRef.close();
  }
}
