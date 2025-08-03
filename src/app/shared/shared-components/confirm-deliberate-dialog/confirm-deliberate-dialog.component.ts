import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-confirm-deliberate-dialog',
    imports: [MatButtonModule, MatDialogModule, MatIconModule],
    templateUrl: './confirm-deliberate-dialog.component.html',
    styleUrls: ['./confirm-deliberate-dialog.component.scss']
})
export class ConfirmDeliberateDialogComponent {
  name: string | undefined;
  message: string | undefined;
  description: string | undefined;
  extra: string | undefined;
  confirmText: string = '';
  constructor(
    private dialogRef: MatDialogRef<ConfirmDeliberateDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string;
      message: string;
      description: string;
      extra: string;
    }
  ) {
    this.name = data.name;
    this.message = data.message;
    this.description = data.description;
    this.extra = data.extra;
    this.dialogRef.disableClose = true;
  }

  onConfirm() {
    this.dialogRef.close('confirm');
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirmTextChange(event: any) {
    this.confirmText = event.target.value;
  }
}
