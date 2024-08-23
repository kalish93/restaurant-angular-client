import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserFacade } from '../../facade/user.facade';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LOGIN_ROUTE } from 'src/app/core/constants/routes';

interface ChangePasswordComponentState {
  changePasswordSuccess: boolean;
}

const initChangePasswordComponentState: Partial<ChangePasswordComponentState> =
  {
    changePasswordSuccess: false,
  };

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [RxState],
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  changePasswordForm = this.fb.group({
    currentPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordPattern),
        this.currentAndNewPasswordEqualityValidator,
      ],
    ],
    currentUsername: ['', [Validators.required]],
  });

  changePasswordSuccess$: Observable<boolean> = this.state.select(
    'changePasswordSuccess'
  );
  hideCurrentPassword = true;
  hideNewPassword = true;

  constructor(
    private fb: NonNullableFormBuilder,
    private userFacade: UserFacade,
    private state: RxState<ChangePasswordComponentState>,
    private router: Router
  ) {
    this.state.set(initChangePasswordComponentState);
    this.state.connect(
      'changePasswordSuccess',
      userFacade.isChangePasswordSuccessful$
    );
  }

  ngOnInit(): void {
    this.changePasswordSuccess$.subscribe((result) => {
      if (result) {
        this.router.navigate([LOGIN_ROUTE]);
      }
    });
  }
  ngOnDestroy(): void {
    this.userFacade.dispatchResetChangePasswordStatus();
  }

  toggleVisibility(field: string) {
    if (field === 'currentPassword') {
      this.hideCurrentPassword = !this.hideCurrentPassword;
    } else if (field === 'newPassword') {
      this.hideNewPassword = !this.hideNewPassword;
    }
  }
  currentAndNewPasswordEqualityValidator(control: AbstractControl) {
    if (!control.parent) {
      return null;
    }
    const currentPassword = control.parent.get('currentPassword')?.value;
    const newPassword = control.value;

    if (currentPassword === newPassword) {
      return { samePassword: true };
    }

    return null;
  }

  changePassword() {
    const { valid, touched, dirty } = this.changePasswordForm;

    if (
      valid &&
      (touched || dirty) &&
      this.changePasswordForm.value.currentPassword &&
      this.changePasswordForm.value.newPassword &&
      this.changePasswordForm.value.currentUsername
    ) {
      this.userFacade.dispatchChangePassword({
        currentPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        currentUsername: this.changePasswordForm.value.currentUsername,
      });
    }
  }
}
