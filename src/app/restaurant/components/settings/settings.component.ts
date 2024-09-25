import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import { jwtDecode } from 'jwt-decode';
import { Restaurant } from '../../models/restaurant.model';
import { MatDialog } from '@angular/material/dialog';
import { CreditCardFormComponent } from '../payment/credit-card-form/credit-card-form.component';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { DiscountFormComponent } from '../payment/discount-form/discount-form.component';

interface SettingsComponentState {
  restaurant: Restaurant | null;
  accessToken: any;
  creditCards: any[];
  discounts: any[];
  zReportData: any;
}

const initSettingsComponentState: Partial<SettingsComponentState> = {
  restaurant: null,
  accessToken: undefined,
  creditCards: [],
  discounts: [],
  zReportData: null,
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  settingsForm: FormGroup;

  restaurant$ = this.state.select('restaurant');
  restaurant: any;
  accessToken$ = this.state.select('accessToken');
  decoded: any;

  creditCards$ = this.state.select('creditCards');
  creditCards: any[] = [];
  discounts$ = this.state.select('discounts');
  discounts: any[] = [];
  zReportData$ = this.state.select('zReportData');
  zReportData: any;

  constructor(
    private fb: FormBuilder,
    private state: RxState<SettingsComponentState>,
    private restaurantFacade: RestaurantFacade,
    private authFacade: AuthFacade,
    private dialog: MatDialog
  ) {
    this.state.set(initSettingsComponentState);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$);
    this.state.connect('accessToken', this.authFacade.accessToken$);
    this.state.connect('creditCards', this.restaurantFacade.creditCards$);
    this.state.connect('discounts', this.restaurantFacade.discounts$);
    this.state.connect('zReportData', this.restaurantFacade.zReportData$);
    this.accessToken$.subscribe((token) => {
      this.decoded = jwtDecode(token);
      this.restaurantFacade.dispatchGetRestaurant(this.decoded.restaurantId);
    });
    this.settingsForm = this.fb.group({
      taxRate: [null, [Validators.required, Validators.min(0)]],
      restaurantStatus: [false],
    });
  }

  ngOnInit(): void {
    this.restaurant$.subscribe((data) => {
      this.restaurant = data;
      this.loadSettings();
    });

    this.restaurantFacade.dispatchGetCreditCards(this.restaurant.id);
    this.restaurantFacade.dispatchGetDiscounts(this.restaurant.id);
    this.creditCards$.subscribe((data) => {
      this.creditCards = data;
    });
    this.discounts$.subscribe((data) => {
      this.discounts = data;
    });

    this.restaurantFacade.dispatchGetZreportData(this.restaurant.id);
    this.zReportData$.subscribe((data) => {
      this.zReportData = data;
    });
  }

  loadSettings() {
    this.settingsForm.patchValue({
      taxRate: this.restaurant?.taxRate,
      restaurantStatus: this.restaurant?.isOpen,
    });
  }

  onOpenOrClose() {
    const dataToSend = {
      restaurantId: this.restaurant.id,
      isOpen: !this.restaurant.isOpen,
    };

    this.restaurantFacade.dispatchUpdateRestaurantStatus(dataToSend);
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      const settings = this.settingsForm.value;
      const dataToSend = {
        restaurantId: this.restaurant.id,
        taxRate: settings.taxRate,
      };

      this.restaurantFacade.dispatchUpdateRestaurantTaxRate(dataToSend);
    }
  }

  removeCard(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to remove this credit card?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirm') {
        this.restaurantFacade.dispatchDeleteCreditCard(id);
      }
    });
  }

  removeDiscount(id: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to remove this discount?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirm') {
        this.restaurantFacade.dispatchDeleteDiscount(id);
      }
    });
  }

  addCard() {
    const dialogRef = this.dialog.open(CreditCardFormComponent, {
      width: '400px',
      data: { restaurantId: this.restaurant.id },
    });

    dialogRef.afterClosed();
  }

  addDiscount() {
    const dialogRef = this.dialog.open(DiscountFormComponent, {
      width: '400px',
      data: { restaurantId: this.restaurant.id },
    });

    dialogRef.afterClosed();
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleDateString(); // Format the date
  }

  pritntZreport() {
    this.restaurantFacade.dispatchGetZreportData(this.restaurant.id);
    this.zReportData$.subscribe((data) => {
      this.zReportData = data;
    });

    let totalPayment = 0; // Initialize to 0
    Object.entries(this.zReportData.paymentDetails).forEach(
      ([categoryName, amount]) => {
        // Check if amount is a number before adding
        if (typeof amount === 'number') {
          totalPayment += amount;
        }
      }
    );

    let totalCredit = 0;
    this.zReportData.creditCardBreakdown.map(
      (item: any) => (totalCredit += item.amount)
    );

    const printableContent = `
    <div style=" width: 100%; padding: 10px; font-size: 13px; max-width: 80mm">
      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Z Report</span>
        <span>${this.getCurrentDate()}</span>
      </div>
      <hr/>

      <h5 style="text-align: center; text-transform: uppercase;">Sales And Taxes Summary</h5>
      <hr />

      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Total Net Sales</span>
        <span>${this.zReportData.totalSales.toFixed(2)}</span>
      </div>

      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Tax</span>
        <span>${this.zReportData.totalTax.toFixed(2)}</span>
      </div>

      <hr />

      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Total Sales</span>
        <span>${(
          this.zReportData.totalTax + this.zReportData.totalSales
        ).toFixed(2)}</span>
      </div>
       <h5 style="text-align: center; text-transform: uppercase;">Sales Categories</h5>
      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Category</span>
        <span>Quantity Net Sales</span>
      </div>
      <hr />

      ${Object.entries(this.zReportData.categorySales)
        .map(([categoryName, salesData]) => {
          const data = salesData as any; // Type assertion
          return `
          <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
            <span>${categoryName}</span>
            <span>(${data.quantitySold}) ${data.totalSales.toFixed(2)}</span>
          </div>
        `;
        })
        .join('')}
      <hr />
      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Total Net Sales</span>
        <span>${this.zReportData.totalSales.toFixed(2)}</span>
      </div>

       <h5 style="text-align: center; text-transform: uppercase;">Payment Details</h5>
      <hr />

    ${Object.entries(this.zReportData.paymentDetails)
      .map(([categoryName, amount]) => {
        let a = amount as any;
        return `
          <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
            <span>${categoryName}</span>
            <span>${a.toFixed(2)}</span>
          </div>
        `;
      })
      .join('')}

      <hr />
      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Total Payment</span>
        <span>${totalPayment.toFixed(2)}</span>
      </div>

      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Total Payment - Total Sales</span>
        <span>${(
          totalPayment -
          (this.zReportData.totalTax + this.zReportData.totalSales)
        ).toFixed(2)}</span>
      </div>

       <h5 style="text-align: center; text-transform: uppercase;">Server TipOuts</h5>
      <hr />

       <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Total Cash Before Tip</span>
        <span>${this.zReportData.paymentDetails.cash.toFixed(2)}</span>
      </div>
       <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Total Tip</span>
        <span>${this.zReportData.totalTips.toFixed(2)}</span>
      </div>

      <hr />
     <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Total Cash</span>
        <span>${(
          this.zReportData.paymentDetails.cash - this.zReportData.totalTips
        ).toFixed(2)}</span>
      </div>

       <h5 style="text-align: center; text-transform: uppercase;">Total Discounts</h5>
      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
        <span>Discount Name</span>
        <span>Count    Amount</span>
      </div>
      <hr />

      ${Object.entries(this.zReportData.discounts)
        .map(([categoryName, discountData]) => {
          const data = discountData as any; // Type assertion
          return `
          <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
            <span>${categoryName}</span>
            <span>(${data.count})          ${data.total.toFixed(2)}</span>
          </div>
        `;
        })
        .join('')}

       <h5 style="text-align: center; text-transform: uppercase;">Credit Card Breakdown</h5>
      <hr />
      ${this.zReportData.creditCardBreakdown
        .map(
          (item: any) => `
        <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
          <span>${item.cardType}</span>
          <span>${item.amount.toFixed(2)}</span>
        </div>
      `
        )
        .join('')}
      <hr />
      <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
          <span>Total</span>
          <span>${totalCredit.toFixed(2)}</span>
        </div>

    </div>
  `;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printableContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload()
  }
}
