import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RestaurantFacade } from '../../../facades/restaurant.facade';

@Component({
    selector: 'app-table-form',
    templateUrl: './table-form.component.html',
    styleUrl: './table-form.component.scss',
    standalone: false
})
export class TableFormComponent {
  addTableForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TableFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restaurantFacade: RestaurantFacade
  ) {
    this.addTableForm = this.fb.group({
      number: ['', [Validators.required]]
    });

    if(data.table){
      this.addTableForm.get('number')?.setValue(data.table.number);
    }
  }

  onSubmit(): void {
    if (this.addTableForm.valid) {

      if(this.data.table){
        const updatedTable = {
          id: this.data.table.id,
          number: this.addTableForm.value.number,
        }
        this.restaurantFacade.dispatchUpdateTable(updatedTable);

      }else{
      const newTable = {
        number: this.addTableForm.value.number,
      };

      this.restaurantFacade.dispatchCreateTable(newTable);
    }
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
