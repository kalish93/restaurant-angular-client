import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockFacade } from 'src/app/restaurant/facades/stock.facae';

@Component({
  selector: 'app-add-stock-modal',
  templateUrl: './add-stock-modal.component.html',
  styleUrls: ['./add-stock-modal.component.scss']
})
export class AddStockModalComponent {
  stockForm: FormGroup;
  imageFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddStockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private stockFacade: StockFacade
  ) {
    this.stockForm = this.fb.group({
      name: ['', Validators.required],
      quantity: [null, Validators.required],
    });

    if(data.stock){
      this.stockForm.get('name')?.setValue(data.stock.name);
      this.stockForm.get('quantity')?.setValue(data.stock.quantity);
      this.imageFile = data.stock.image;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.stockForm.valid && this.imageFile) {
      const formData = new FormData();
      formData.append('name', this.stockForm.get('name')?.value);
      formData.append('quantity', this.stockForm.get('quantity')?.value);
      formData.append('image', this.imageFile);

      if(this.data.stock){
        this.stockFacade.dispatchUpdateStock(this.data.stock.id, formData);

      }else{
        this.stockFacade.dispatchCreateStock(formData);
      }
      this.dialogRef.close(formData);
    }
  }
}
