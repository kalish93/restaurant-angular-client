// import { Component, Inject, OnInit } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { RxState } from '@rx-angular/state';
// import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';

// interface PaymentOptionFormComponentState {
//   creditCards: any[]
// }

// const initPaymentOptionFormComponentState: Partial<PaymentOptionFormComponentState> = {
//   creditCards: []
// };

// @Component({
//   selector: 'app-payment-option-form',
//   templateUrl: './payment-option-form.component.html',
//   styleUrl: './payment-option-form.component.scss',
//   providers: [RxState]
// })
// export class PaymentOptionFormComponent implements OnInit{
//   paymentForm: FormGroup;

//   creditCards$ = this.state.select('creditCards');
//   applicableCards: any[] = [];

//   constructor(
//     private fb: FormBuilder,
//     private dialogRef: MatDialogRef<PaymentOptionFormComponent>,
//     private state: RxState<PaymentOptionFormComponentState>,
//     private restaurantFacade: RestaurantFacade,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//   ) {

//     this.state.set(initPaymentOptionFormComponentState);
//     this.state.connect('creditCards', this.restaurantFacade.creditCards$);
//     this.paymentForm = this.fb.group({
//       cashPayment: [0, [Validators.required, Validators.min(0)]],
//       giftCardPayment: [0, [Validators.required, Validators.min(0)]],
//       creditCards: this.fb.array([]),
//       totalPayment: [{ value: 0, disabled: true }]
//     });

//     this.updateTotalPayment();
//   }

//   ngOnInit(): void {
//     this.restaurantFacade.dispatchGetCreditCards(this.data.restaurantId);
//     this.creditCards$.subscribe((data)=>{
//       this.applicableCards = data;
//     })
//   }

//   // Create a credit card form group
//   createCreditCard(): FormGroup {
//     return this.fb.group({
//       creditPayment: [0, [Validators.required, Validators.min(0)]],
//       creditCardType: ['Visa', Validators.required]
//     });
//   }

//   // Get the form array for credit cards
//   creditCards(): FormArray {
//     return this.paymentForm.get('creditCards') as FormArray;
//   }

//   // Add another credit card
//   addCreditCard() {
//     this.creditCards().push(this.createCreditCard());
//   }

//   // Remove a credit card by index
//   removeCreditCard(index: number) {
//     // if (this.creditCards().length > 1) {
//       this.creditCards().removeAt(index);
//     // }
//   }

//   // Update the total payment
//   updateTotalPayment() {
//     this.paymentForm.valueChanges.subscribe(values => {
//       const totalCash = values.cashPayment || 0;
//       const totalGiftCard = values.giftCardPayment || 0;
//       const totalCreditCards = values.creditCards.reduce(
//         (sum: number, card: any) => sum + (card.creditPayment || 0),
//         0
//       );

//       const total = totalCash + totalGiftCard + totalCreditCards;
//       this.paymentForm.get('totalPayment')?.setValue(total, { emitEvent: false });
//     });
//   }

//   closeModal() {
//     if (this.paymentForm.valid) {
//       this.dialogRef.close(this.paymentForm.value); // Pass form value to parent component
//     }
//   }
// }
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-option-form',
  templateUrl: './payment-option-form.component.html',
  styleUrl: './payment-option-form.component.scss'
})
export class PaymentOptionFormComponent implements OnInit {
  paymentForm: FormGroup;
  isTotalMismatch: boolean = true;

  providers = ['Telebirr', 'CBE Birr', 'CBE', 'Abiyssinia'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentOptionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentForm = this.fb.group({
      cashPaymentAmount: [0, [Validators.min(0)]],
      provider: [null],
      transferAmount: [0, [Validators.min(0)]],
      totalPayment: [{ value: 0, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.updateTotalPayment();
  }

  updateTotalPayment() {
    this.paymentForm.valueChanges.subscribe(values => {
      const totalCash = values.cashPaymentAmount || 0;
      const totalTransfer = values.transferAmount || 0;

      const total = totalCash + totalTransfer;
      this.paymentForm.get('totalPayment')?.setValue(total, { emitEvent: false });

      this.isTotalMismatch = total !== this.data.total;
    });
  }

  closeModal() {
    if (this.paymentForm.valid) {
      this.dialogRef.close(this.paymentForm.value);
    }
  }
}
