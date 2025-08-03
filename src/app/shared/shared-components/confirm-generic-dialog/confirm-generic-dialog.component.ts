import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-generic-dialog',
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './confirm-generic-dialog.component.html',
    styleUrls: ['./confirm-generic-dialog.component.scss']
})
export class ConfirmGenericDialogComponent {
  message: string | undefined;
  title: string | 'Confirm Your Action';
  constructor(
    private dialogRef: MatDialogRef<ConfirmGenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {
    this.message = data.message;
    this.title = data.title;
    this.dialogRef.disableClose = true;
  }

  onConfirm() {
    this.dialogRef.close('confirm');
  }

  onCancel() {
    this.dialogRef.close();
  }
}
