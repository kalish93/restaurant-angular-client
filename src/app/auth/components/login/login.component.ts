import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { AuthFacade } from '../../facade/auth.facade';
import { RxState } from '@rx-angular/state';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  HOME_ROUTE,
  USERS_ROUTE,
  FORGET_PASSWORD_ROUTE,
} from 'src/app/core/constants/routes';
import { Store } from '@ngxs/store';
import { RestaurantFacade } from '../../../restaurant/facades/restaurant.facade'
interface LoginComponentState {
  isAuthenticated: boolean;
  isPasswordVisible: boolean;
  currentRestaurant: any | undefined
}

const initLoginComponentState: Partial<LoginComponentState> = {
  isAuthenticated: true,
  isPasswordVisible: true,
  currentRestaurant: undefined
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [RxState],
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  isAuthenticated$: Observable<boolean> = this.state.select('isAuthenticated');
  currentRestaurant$: Observable<any> = this.state.select('currentRestaurant');
  constructor(
    private fb: NonNullableFormBuilder,
    private authFacade: AuthFacade,
    private state: RxState<LoginComponentState>,
    private router: Router,
    private restaurantFacade: RestaurantFacade
  ) {
    this.state.set(initLoginComponentState);
    this.state.connect('isAuthenticated', authFacade.isAuthenticated$);
    this.state.connect('currentRestaurant', restaurantFacade.selectedRestaurant$);
  }

ngOnInit(): void {
  this.isAuthenticated$.subscribe((result) => {
    if (result) {
      this.currentRestaurant$.subscribe((restaurant) => {
        if (restaurant) {
          if (restaurant.subscription === 'BASIC') {
            this.router.navigate(['/home/menu']);
          } else {
            this.router.navigate(['/home/dashboard']);
          }
        }
      });
    }
  });
}


  get emailValidationError() {
    return this.loginForm.controls.email;
  }

  get isPasswordVisible() {
    const { isPasswordVisible } = this.state.get();
    return isPasswordVisible;
  }
  forgetPasswoerd() {
    this.router.navigate([FORGET_PASSWORD_ROUTE]);
  }

  togglePasswordVisibility() {
    const { isPasswordVisible } = this.state.get();
    this.state.set({ isPasswordVisible: !isPasswordVisible });
  }

  login() {
    const { valid, touched, dirty } = this.loginForm;

    if (
      valid &&
      (touched || dirty) &&
      this.loginForm.value.email &&
      this.loginForm.value.password
    ) {
      this.authFacade.dispatchLogin({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      });
    }
  }
}
