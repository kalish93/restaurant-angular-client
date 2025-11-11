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
import { API_BASE_URL, MEDIA_URL } from 'src/app/core/constants/api-endpoints';
import { formatDate } from '@angular/common';

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
    // { id: 'business', name: 'Business' },
    { id: 'reports', name: 'Reports' },
  ];
  activeTab: string = 'profile';

  // Logo management
  logoPreview: string | null = null;
  selectedFile: File | null = null;

  // Loading states
  isProfileLoading = false;
  isAppearanceLoading = false;
  isLogoLoading = false;

  selectedDate: Date = new Date();
  loadingReport = false;
  dailyReport: any = null;
  // Color palette management
  // Color palette management
// presetPalettes: ColorPalette[] = [
//   { id: 'blue', name: 'Ocean Blue', colors: ['#3B82F6', '#E0F2FE', '#1E3A8A'] },       // blue highlight, light bg, dark text
//   { id: 'green', name: 'Forest Green', colors: ['#16A34A', '#DCFCE7', '#065F46'] },     // green highlight, soft green bg, dark green text
//   { id: 'purple', name: 'Royal Purple', colors: ['#7C3AED', '#EDE9FE', '#4C1D95'] },    // purple highlight, light purple bg, deep purple text
//   { id: 'red', name: 'Sunset Red', colors: ['#DC2626', '#FEE2E2', '#7F1D1D'] },         // red highlight, soft red bg, dark red text
//   { id: 'teal', name: 'Teal Dream', colors: ['#0D9488', '#CCFBF1', '#115E59'] },        // teal highlight, light teal bg, dark teal text
//   { id: 'orange', name: 'Sunrise Orange', colors: ['#F97316', '#FFF7ED', '#C2410C'] },  // orange highlight, light orange bg, deep orange text
//   { id: 'pink', name: 'Blush Pink', colors: ['#EC4899', '#FCE7F3', '#831843'] },        // pink highlight, light pink bg, dark pink text
//   { id: 'cyan', name: 'Cool Cyan', colors: ['#06B6D4', '#E0F7FA', '#07575B'] },         // cyan highlight, soft cyan bg, dark cyan text
//   { id: 'amber', name: 'Golden Amber', colors: ['#F59E0B', '#FFFBEB', '#78350F'] },     // amber highlight, pale bg, dark amber text
//   { id: 'violet', name: 'Violet Sky', colors: ['#8B5CF6', '#F3E8FF', '#4C1D95'] },      // violet highlight, soft violet bg, dark violet text
//   { id: 'emerald', name: 'Emerald Green', colors: ['#10B981', '#ECFDF5', '#065F46'] },  // emerald highlight, light green bg, dark green text
//   { id: 'sky', name: 'Sky Blue', colors: ['#0EA5E9', '#E0F2FE', '#0C4A6E'] },           // sky highlight, soft blue bg, deep blue text
//   { id: 'coral', name: 'Coral Reef', colors: ['#FB7185', '#FFF1F2', '#9D174D'] },       // coral highlight, pale bg, dark coral text
//   { id: 'mint', name: 'Mint Fresh', colors: ['#6EE7B7', '#ECFDF5', '#047857'] },        // mint highlight, soft mint bg, dark mint text
//   { id: 'lavender', name: 'Lavender Mist', colors: ['#C084FC', '#F5F3FF', '#6D28D9'] }, // lavender highlight, light bg, dark purple text
//   { id: 'peach', name: 'Peach Sunset', colors: ['#FDBA74', '#FFF7ED', '#C2410C'] },     // peach highlight, light bg, dark peach text
//   { id: 'sand', name: 'Sandy Beach', colors: ['#FDE68A', '#FEFCE8', '#78350F'] },       // sandy highlight, soft cream bg, deep sand text
// ];
presetPalettes: ColorPalette[] = [
  // Original palettes
  { id: 'default', name: 'Default', colors: ['#F97316', '#F9FAFB', '#374151'] },
  { id: 'blue', name: 'Ocean Blue', colors: ['#3B82F6', '#E0F2FE', '#1E3A8A'] },
  { id: 'green', name: 'Forest Green', colors: ['#16A34A', '#DCFCE7', '#065F46'] },
  { id: 'purple', name: 'Royal Purple', colors: ['#7C3AED', '#EDE9FE', '#4C1D95'] },
  { id: 'red', name: 'Sunset Red', colors: ['#DC2626', '#FEE2E2', '#7F1D1D'] },
  { id: 'teal', name: 'Teal Dream', colors: ['#0D9488', '#CCFBF1', '#115E59'] },
  { id: 'orange', name: 'Sunrise Orange', colors: ['#F97316', '#FFF7ED', '#C2410C'] },
  { id: 'pink', name: 'Blush Pink', colors: ['#EC4899', '#FCE7F3', '#831843'] },
  { id: 'cyan', name: 'Cool Cyan', colors: ['#06B6D4', '#E0F7FA', '#07575B'] },
  { id: 'amber', name: 'Golden Amber', colors: ['#F59E0B', '#FFFBEB', '#78350F'] },
  { id: 'violet', name: 'Violet Sky', colors: ['#8B5CF6', '#F3E8FF', '#4C1D95'] },
  { id: 'emerald', name: 'Emerald Green', colors: ['#10B981', '#ECFDF5', '#065F46'] },
  { id: 'sky', name: 'Sky Blue', colors: ['#0EA5E9', '#E0F2FE', '#0C4A6E'] },
  { id: 'coral', name: 'Coral Reef', colors: ['#FB7185', '#FFF1F2', '#9D174D'] },
  { id: 'mint', name: 'Mint Fresh', colors: ['#6EE7B7', '#ECFDF5', '#047857'] },
  { id: 'lavender', name: 'Lavender Mist', colors: ['#C084FC', '#F5F3FF', '#6D28D9'] },
  { id: 'peach', name: 'Peach Sunset', colors: ['#FDBA74', '#FFF7ED', '#C2410C'] },
  { id: 'sand', name: 'Sandy Beach', colors: ['#FDE68A', '#FEFCE8', '#78350F'] },

  // Complementary / elegant palettes
  { id: 'classicBlackWhite', name: 'Classic Black & White', colors: ['#000000', '#FFFFFF', '#4B5563'] }, // black highlight, white bg, gray text
  { id: 'charcoalElegance', name: 'Charcoal Elegance', colors: ['#1F2937', '#F9FAFB', '#6B7280'] }, // charcoal highlight, light bg, subtle gray text
  { id: 'goldLuxury', name: 'Gold Luxury', colors: ['#D4AF37', '#FDF6E3', '#5C4033'] }, // gold highlight, cream bg, dark brown text
  { id: 'wineRed', name: 'Wine & Elegance', colors: ['#7F1D1D', '#FBE4E4', '#3B0B0B'] }, // deep red highlight, soft pink bg, almost black text
  { id: 'forestElegance', name: 'Forest Elegance', colors: ['#065F46', '#DCFCE7', '#134E4A'] }, // dark green, soft green bg, deep green text
  { id: 'pearlGray', name: 'Pearl Gray', colors: ['#6B7280', '#F3F4F6', '#111827'] }, // gray highlight, light gray bg, dark gray text
  { id: 'royalGold', name: 'Royal Gold', colors: ['#B45309', '#FEF3C7', '#78350F'] }, // warm gold highlight, cream bg, brown text
  { id: 'ivoryBlush', name: 'Ivory Blush', colors: ['#FFF8F0', '#FEE2E2', '#9D174D'] }, // ivory bg, light pink, deep pink text
  { id: 'navyElegance', name: 'Navy Elegance', colors: ['#1E3A8A', '#E0F2FE', '#0C1A4B'] }, // navy highlight, pale blue bg, dark navy text

  // Modern / trendy complementary palettes
  { id: 'sunsetTeal', name: 'Sunset Teal', colors: ['#0D9488', '#FDE68A', '#115E59'] },
  { id: 'skyAmber', name: 'Sky Amber', colors: ['#0EA5E9', '#FBBF24', '#78350F'] },
  { id: 'roseGold', name: 'Rose Gold', colors: ['#EC4899', '#FCD34D', '#831843'] },
];

availableFonts: string[] = [
  // Modern & readable
  'Poppins',
  'Roboto',
  'Montserrat',

  // Elegant serif
  'Playfair Display',
  'Merriweather',
  'Lora',
  'Cormorant Garamond',

  // Monospace
  'Fira Code',

  // Cursive / handwritten
  'Dancing Script',
  'Pacifico',
  'Great Vibes',
  'Caveat'  // Handwritten
];


selectedFont: string = 'Poppins'; // default font
public currentFont: string = 'Poppins';

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
  apiUrl: string = MEDIA_URL;
  public currentPrimaryColor: string = '#F97316';
  public currentSecondaryColor: string = '#F9FAFB';
  public currentAccentColor: string = '#374151';

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
        '#F97316',
        [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)],
      ],
      secondaryColor: [
        '#F9FAFB',
        [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)],
      ],
      accentColor: [
        '#374151',
        [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)],
      ],
      fontType: ['Poppins', Validators.required], 
    });

    // CRITICAL FIX: Subscribe to form value changes to update live preview
    this.appearanceForm.valueChanges.subscribe(values => {
      this.currentPrimaryColor = values.primaryColor;
      this.currentSecondaryColor = values.secondaryColor;
      this.currentAccentColor = values.accentColor;
      this.currentFont = values.fontType;
    });
  }

  ngOnInit(): void {
    this.restaurant$.subscribe((data) => {
      if (data) {
        this.restaurant = data;
        const today = new Date();

        const formattedDate = formatDate(today, 'yyyy-MM-dd', 'en');
        this.restaurantFacade.dispatchGetZreportData(this.restaurant.id, formattedDate);
        this.getDailyReport()
      }
    });
    this.loadSettings();

    // Ensure the get methods are called inside the restaurant subscription or when needed
    // this.restaurantFacade.dispatchGetCreditCards(this.restaurant.id);
    // this.restaurantFacade.dispatchGetDiscounts(this.restaurant.id);
    this.creditCards$.subscribe((data) => {
      this.creditCards = data;
    });
    this.discounts$.subscribe((data) => {
      this.discounts = data;
    });

    this.zReportData$.subscribe((data) => {
      this.zReportData = data;
    });
  }

  selectFont(font: string) {
  this.selectedFont = font;
  this.appearanceForm.patchValue({ fontType: font });
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
    const savedColors = this.getSavedColors() || {};
    this.appearanceForm.patchValue({
      primaryColor: savedColors.primaryColor || '#F97316',
      secondaryColor: savedColors.secondaryColor || '#F9FAFB',
      accentColor: savedColors.accentColor || '#374151',
      fontType: savedColors.fontType || 'Poppins',
    }, { emitEvent: false });

    // FIX: Initialize the live preview variables from the form's current value
    this.currentPrimaryColor = this.appearanceForm.get('primaryColor')?.value || this.currentPrimaryColor;
    this.currentSecondaryColor = this.appearanceForm.get('secondaryColor')?.value || this.currentSecondaryColor;
    this.currentAccentColor = this.appearanceForm.get('accentColor')?.value || this.currentAccentColor;
    this.currentFont = this.appearanceForm.get('fontType')?.value || this.currentFont;
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
    const colors = {
      primaryColor: palette.colors[0],
      secondaryColor: palette.colors[1],
      accentColor: palette.colors[2],
    };

    // FIX: Set colors on the form, which will update the live variables via valueChanges subscription
    // Using { emitEvent: true } (the default) is fine here, but if the issue persists, 
    // you can use { emitEvent: false } and manually update the currentXxxColor variables.
    this.appearanceForm.patchValue(colors);
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

  getDailyReport() {
    if (!this.restaurant || !this.restaurant.id) return;

    this.loadingReport = true;
    const formattedDate = formatDate(this.selectedDate, 'yyyy-MM-dd', 'en');

    // Call backend via your existing facade
    this.restaurantFacade.dispatchGetZreportData(this.restaurant.id, formattedDate);

    this.zReportData$.subscribe({
      next: (data) => {
        this.dailyReport = data;
        this.loadingReport = false;
      },
      error: (err) => {
        console.error('Error fetching daily report:', err);
        this.loadingReport = false;
        this.dailyReport = null;
      },
    });
  }
}