import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { UserFacade } from '../../facade/user.facade';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {
  LOGIN_ROUTE,
  FORGET_PASSWORD_ROUTE,
} from 'src/app/core/constants/routes';

interface ResetPasswordComponentState {
  resetPasswordSuccess: boolean;
}

const initResetPasswordComponentState: Partial<ResetPasswordComponentState> = {
  resetPasswordSuccess: false,
};

@Component({
  selector: 'change-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [RxState],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  resetPasswordForm = this.fb.group({
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern),
      ],
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern),
        this.confirmAndNewPasswordEqualityValidator,
      ],
    ],
  });

  resetPasswordSuccess$: Observable<boolean> = this.state.select(
    'resetPasswordSuccess'
  );
  userId!: string;
  token!: string;
  hideConfirmPassword = true;
  hideNewPassword = true;

  constructor(
    private fb: NonNullableFormBuilder,
    private userFacade: UserFacade,
    private state: RxState<ResetPasswordComponentState>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.state.set(initResetPasswordComponentState);
    this.state.connect(
      'resetPasswordSuccess',
      userFacade.isResetPasswordSuccessful$
    );
  }

  ngOnInit(): void {
    this.resetPasswordSuccess$.subscribe((result) => {
      if (result) {
        this.router.navigate([LOGIN_ROUTE]);
      }
    });
    this.route.queryParams.subscribe((params) => {
      const userId = params['userId'];
      const token = params['token'];
      this.userId = userId;
      this.token = token;
    });
  }

  ngOnDestroy(): void {
    this.userFacade.dispatchResetResetPasswordStatus();
  }

  toggleVisibility(field: string) {
    if (field === 'confirmPassword') {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    } else if (field === 'newPassword') {
      this.hideNewPassword = !this.hideNewPassword;
    }
  }

  confirmAndNewPasswordEqualityValidator(control: AbstractControl) {
    if (!control.parent) {
      return null;
    }
    const newPassword = control.parent.get('newPassword')?.value;
    const confirmPassword = control.value;

    if (newPassword != confirmPassword) {
      return { notMatched: true };
    }

    return null;
  }

  resetPassword() {
    const { valid, touched, dirty } = this.resetPasswordForm;
    if (
      valid &&
      (touched || dirty) &&
      this.resetPasswordForm.value.newPassword &&
      this.resetPasswordForm.value.confirmPassword
    ) {
      this.userFacade.dispatchResetPassword({
        userId: this.userId,
        token: this.token,
        newPassword: this.resetPasswordForm.value.newPassword,
        confirmPassword: this.resetPasswordForm.value.confirmPassword,
      });
    }
  }
}
