import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-confirm-with-date-dialog',
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatDatepickerModule,
    ],
    templateUrl: './confirm-with-date-dialog.component.html',
    styleUrls: ['./confirm-with-date-dialog.component.scss']
})
export class ConfirmWithDateDialogComponent {
  minDate = new Date();
  maxDate = new Date(this.minDate).setFullYear(this.minDate.getFullYear() + 1);
  name: string | undefined;
  message: string | undefined;
  description: string | undefined;
  extra: string | undefined;
  confirmText: string = '';
  date: string | undefined;

  constructor(
    private dialogRef: MatDialogRef<ConfirmWithDateDialogComponent>,
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
    const result = {
      confirmText: 'confirm',
      date: this.date,
    };
    this.dialogRef.close(result);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirmDateChange(event: any) {
    this.date = event.target.value;
  }
}
