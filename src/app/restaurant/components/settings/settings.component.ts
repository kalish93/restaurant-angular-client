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
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';

interface SettingsComponentState {
  restaurant: Restaurant | null;
  accessToken: any;
  creditCards: any[];
  discounts: any[];
  zReportData: any;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

interface Tab {
  id: string;
  name: string;
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
  profileForm: FormGroup;
  appearanceForm: FormGroup;

  // Tab management
  tabs: Tab[] = [
    { id: 'profile', name: 'Profile' },
    { id: 'appearance', name: 'Appearance' },
    { id: 'business', name: 'Business' },
  ];
  activeTab: string = 'profile';

  // Logo management
  logoPreview: string | null = null;
  selectedFile: File | null = null;

  // Loading states
  isProfileLoading = false;
  isAppearanceLoading = false;
  isLogoLoading = false;

  // Color palette management
  presetPalettes: ColorPalette[] = [
    {
      id: 'blue',
      name: 'Ocean Blue',
      colors: ['#3B82F6', '#10B981', '#F59E0B'],
    },
    {
      id: 'green',
      name: 'Forest Green',
      colors: ['#059669', '#10B981', '#F59E0B'],
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      colors: ['#7C3AED', '#EC4899', '#F59E0B'],
    },
    {
      id: 'red',
      name: 'Sunset Red',
      colors: ['#DC2626', '#F59E0B', '#10B981'],
    },
    {
      id: 'gray',
      name: 'Modern Gray',
      colors: ['#374151', '#6B7280', '#F59E0B'],
    },
    {
      id: 'teal',
      name: 'Teal Dream',
      colors: ['#0D9488', '#14B8A6', '#F59E0B'],
    },
  ];
  selectedPalette: ColorPalette | null = null;

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
  apiUrl: string = API_BASE_URL;

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

    // Initialize forms
    this.settingsForm = this.fb.group({
      taxRate: [null, [Validators.required, Validators.min(0)]],
      restaurantStatus: [false],
    });

    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)],
      ],
      address: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.appearanceForm = this.fb.group({
      primaryColor: [
        '#3B82F6',
        [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)],
      ],
      secondaryColor: [
        '#10B981',
        [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)],
      ],
      accentColor: [
        '#F59E0B',
        [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)],
      ],
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

    this.profileForm.patchValue({
      name: this.restaurant?.name || '',
      phone: this.restaurant?.phone || '',
      address: this.restaurant?.address || '',
    });

    // Load saved appearance settings if they exist
    const savedColors = this.getSavedColors();
    if (savedColors) {
      this.appearanceForm.patchValue(savedColors);
    }
  }

  // Profile management methods
  onProfileSubmit() {
    if (this.profileForm.valid) {
      this.isProfileLoading = true;
      const profileData = this.profileForm.value;
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('phone', profileData.phone);
      formData.append('address', profileData.address);

      this.restaurantFacade.dispatchUpdateRestaurant(
        this.restaurant.id,
        formData
      );

      // Simulate loading time and show success message
      setTimeout(() => {
        this.isProfileLoading = false;
        this.showNotification('Profile updated successfully!', 'success');
      }, 1000);
    }
  }

  // Logo management methods
  onLogoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    this.logoPreview = null;
    this.selectedFile = null;
    // Reset file input
    const fileInput = document.getElementById(
      'logo-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadLogo() {
    if (this.selectedFile) {
      // Here you would typically upload the file to your server
      // For now, we'll just simulate the upload
      const formData = new FormData();
      formData.append('logo', this.selectedFile);
      formData.append('restaurantId', this.restaurant.id);

      // Call your service method to upload the logo
      // this.restaurantFacade.dispatchUploadLogo(formData);

      // Show success message
      this.showNotification('Logo uploaded successfully!', 'success');

      console.log('Logo upload initiated:', this.selectedFile.name);
    }
  }

  // Notification method
  private showNotification(
    message: string,
    type: 'success' | 'error' = 'success'
  ) {
    // Create a simple notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-lg transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Appearance management methods
  selectPresetPalette(palette: ColorPalette) {
    this.selectedPalette = palette;
    this.appearanceForm.patchValue({
      primaryColor: palette.colors[0],
      secondaryColor: palette.colors[1],
      accentColor: palette.colors[2],
    });
  }

  onAppearanceSubmit() {
    if (this.appearanceForm.valid) {
      const appearanceData = this.appearanceForm.value;

      // Save colors to localStorage for persistence
      this.saveColors(appearanceData);

      // Apply colors to the application
      this.applyColors(appearanceData);

      // Show success message
      this.showNotification(
        'Appearance settings saved successfully!',
        'success'
      );

      console.log('Appearance settings saved:', appearanceData);
    }
  }

  private saveColors(colors: any) {
    localStorage.setItem('restaurantColors', JSON.stringify(colors));
  }

  private getSavedColors() {
    const saved = localStorage.getItem('restaurantColors');
    return saved ? JSON.parse(saved) : null;
  }

  private applyColors(colors: any) {
    // Apply colors to CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary-color', colors.primaryColor);
    root.style.setProperty('--secondary-color', colors.secondaryColor);
    root.style.setProperty('--accent-color', colors.accentColor);
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
    window.location.reload();
  }
}
