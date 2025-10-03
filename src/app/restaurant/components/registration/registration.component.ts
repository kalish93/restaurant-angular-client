import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RestaurantFacade } from '../../facades/restaurant.facade';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  restaurantForm!: FormGroup;
  subscriptionSelectionForm!: FormGroup;
  staffForm!: FormGroup;

  // New properties for step management
  currentStep = 1;
  steps = ['Restaurant Details', 'Subscription', 'Staff Account'];
  selectedFile: File | null = null;

  logoFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private restaurantFacade: RestaurantFacade
  ) {}

  ngOnInit(): void {
    // STEP 1: Restaurant Details Form
    this.restaurantForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      logo: [null],
    });

    // STEP 2: Subscription Selection Form
    this.subscriptionSelectionForm = this.fb.group({
      subscription: ['STANDARD', Validators.required], // Default to STANDARD
    });

    // STEP 3: Staff Registration Form
    this.staffForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        passwordConfirmation: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Step navigation methods
  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 3) {
      this.currentStep = step;
    }
  }

  // Step indicator styling
  getStepClass(index: number): string {
    if (index < this.currentStep - 1) {
      // ✅ Completed step
      return 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg';
    } else if (index === this.currentStep - 1) {
      // ✅ Current step
      return 'border-2 border-orange-500 bg-white text-orange-600 shadow-md';
    } else {
      // ⏳ Upcoming steps
      return 'bg-gray-200 text-gray-500';
    }
  }

  // Subscription plan selection
  selectPlan(plan: string): void {
    this.subscriptionSelectionForm.patchValue({ subscription: plan });
  }

  // In your component.ts file, update these methods:

  getPlanCardClass(plan: string): string {
    const baseClasses =
      'relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105';
    const isSelected =
      this.subscriptionSelectionForm.get('subscription')?.value === plan;

    if (isSelected) {
      if (plan === 'STANDARD') {
        return `${baseClasses} border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 shadow-xl scale-105`;
      }
      return `${baseClasses} border-orange-400 bg-orange-50 shadow-lg`;
    }

    return `${baseClasses} border-gray-200 bg-white hover:border-orange-300 shadow-md hover:shadow-lg`;
  }

  getPlanButtonClass(plan: string): string {
    const baseClasses =
      'w-full py-3 rounded-xl font-semibold transition-all duration-200';
    const isSelected =
      this.subscriptionSelectionForm.get('subscription')?.value === plan;

    if (isSelected) {
      return `${baseClasses} bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg cursor-default`;
    }

    return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200`;
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirm = control.get('passwordConfirmation')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      this.selectedFile = file;
      this.restaurantForm.patchValue({ logo: file });
    }
  }

  submitAll() {
    if (
      this.restaurantForm.invalid ||
      this.subscriptionSelectionForm.invalid ||
      this.staffForm.invalid
    ) {
      this.snackBar.open(
        'Please complete all required fields correctly',
        'Close',
        {
          duration: 4000,
          panelClass: ['error-snackbar'],
        }
      );
      return;
    }

    const formData = new FormData();

    // Restaurant fields
    const restaurant = this.restaurantForm.value;
    delete restaurant.logo;
    formData.append('restaurant', JSON.stringify(restaurant));

    // Subscription
    formData.append(
      'subscription',
      JSON.stringify(this.subscriptionSelectionForm.value)
    );

    // Staff
    formData.append('staff', JSON.stringify(this.staffForm.value));

    // Logo file if available
    if (this.logoFile) {
      formData.append('logo', this.logoFile, this.logoFile.name);
    }

    console.log('Submitting formatted registration:', {
      restaurant,
      subscription: this.subscriptionSelectionForm.value,
      staff: this.staffForm.value,
    });

    this.snackBar.open('Processing your registration...', 'Close', {
      duration: 2000,
    });

    // Dispatch to facade
    this.restaurantFacade.dispatchSelfRegisterRestaurant(formData);

    // Reset forms after submission
    this.restaurantForm.reset();
    this.subscriptionSelectionForm.patchValue({ subscription: 'STANDARD' });
    this.staffForm.reset();
    this.selectedFile = null;
    this.logoFile = null;
    this.currentStep = 1;
    this.router.navigate(['/login']);
  }

  // Helper method to check if we can proceed to next step
  canProceedToNextStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.restaurantForm.valid;
      case 2:
        return this.subscriptionSelectionForm.valid;
      case 3:
        return this.staffForm.valid;
      default:
        return false;
    }
  }

  // Get current step title for display
  getCurrentStepTitle(): string {
    return this.steps[this.currentStep - 1];
  }
}
