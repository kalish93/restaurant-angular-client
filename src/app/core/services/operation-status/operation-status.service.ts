import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class OperationStatusService {
  constructor(private snackBar: MatSnackBar, private ngZone: NgZone) {}

  displayStatus(
    message: string,
    style = 'warning-snackbar',
    duration = 5000
  ): void {
    this.ngZone.run(() => {
      this.snackBar.open(message, 'Ok', {
        duration: duration,
        panelClass: [style],
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        politeness: 'assertive',
      });
    });
  }
}
