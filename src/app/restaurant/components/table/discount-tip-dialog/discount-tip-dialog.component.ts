import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';

interface DiscountTipDialogComponentState {
  discounts: any[];
}

const initDiscountTipDialogComponentState: Partial<DiscountTipDialogComponentState> = {
  discounts: [],
};

@Component({
  selector: 'app-discount-tip-dialog',
  templateUrl: './discount-tip-dialog.component.html',
  styleUrl: './discount-tip-dialog.component.scss',
  providers: [RxState]
})
export class DiscountTipDialogComponent implements OnInit{
  tipType: 'percentage' | 'fixed' = 'percentage'; // Default to percentage tip
  tipValue: number = 0;
  discount: any;

  discounts$ = this.state.select('discounts');
  discounts: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DiscountTipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private state: RxState<DiscountTipDialogComponentState>,
    private restaurantFacade: RestaurantFacade
  ) {
    this.state.set(initDiscountTipDialogComponentState);
    this.state.connect('discounts', this.restaurantFacade.discounts$);
  }

  ngOnInit(): void {
    this.restaurantFacade.dispatchGetDiscounts(this.data.restaurantId);
    this.discounts$.subscribe((data)=>{
      this.discounts = data;
    })
  }

  onConfirm(): void {
    // Pass back the tip type and value, and discount
    this.dialogRef.close({
      tipType: this.tipType,
      tipValue: this.tipValue,
      discount: this.discount ? this.discount.percentage : 0,
      discountId: this.discount?.id
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
