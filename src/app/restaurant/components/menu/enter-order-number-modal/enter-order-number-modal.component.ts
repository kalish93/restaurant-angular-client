import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-enter-order-number-modal',
    templateUrl: './enter-order-number-modal.component.html',
  styleUrls: ['./enter-order-number-modal.component.scss'],
})
export class EnterOrderNumberModalComponent {
  orderNumberControl = new FormControl('', Validators.required);

  constructor(
    private dialogRef: MatDialogRef<EnterOrderNumberModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submit() {
    this.dialogRef.close(this.orderNumberControl.value);
  }

  close() {
    this.dialogRef.close(null);
  }
}

