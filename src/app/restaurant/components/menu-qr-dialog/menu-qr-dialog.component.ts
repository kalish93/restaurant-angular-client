import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestaurantFacade } from '../../facades/restaurant.facade';

@Component({
  selector: 'app-menu-qr-dialog',
  templateUrl: './menu-qr-dialog.component.html',
  styleUrls: ['./menu-qr-dialog.component.scss']
})
export class MenuQrDialogComponent {
  qrImageUrl: string | null;

  constructor(
    private dialogRef: MatDialogRef<MenuQrDialogComponent>,
    private restaurantFacade: RestaurantFacade,
    @Inject(MAT_DIALOG_DATA) public data: { qrImageUrl: string | null }
  ) {
    this.qrImageUrl = data.qrImageUrl;
  }

  generateQr(): void {
    // this.restaurantFacade.dispatchGenerateMenuQrCode();
    // Optionally: refresh QR after generation if backend returns it automatically
    // setTimeout(() => {
    //   this.qrImageUrl = this.data.qrImageUrl;
    // }, 500);
  }

  downloadQr(): void {
    this.restaurantFacade.dispatchDownloadMenuQrCode();
  }

  close(): void {
    this.dialogRef.close();
  }
}
