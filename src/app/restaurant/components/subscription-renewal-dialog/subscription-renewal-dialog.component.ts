import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subscription-renewal-dialog',
  templateUrl: './subscription-renewal-dialog.component.html',
  styleUrls: ['./subscription-renewal-dialog.component.scss']
})
export class SubscriptionRenewalDialogComponent {

  constructor(private dialogRef: MatDialogRef<SubscriptionRenewalDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
