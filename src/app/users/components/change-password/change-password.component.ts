import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  // passwordPattern =
  //   /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  changePasswordForm = this.fb.group({
    email: ['', Validators.required],
    currentPassword: ['', [Validators.required]],
    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        this.currentAndNewPasswordEqualityValidator,
      ],
    ],
    confirmNewPassword: [
      '',
      [Validators.required, this.confirmNewPasswordValidator()],
    ],
  });

  changePasswordSuccess$: Observable<boolean> = this.state.select(
    'changePasswordSuccess'
  );
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmNewPassword = true;

  constructor(
    private fb: NonNullableFormBuilder,
    private userFacade: UserFacade,
    private state: RxState<ChangePasswordComponentState>,
    private router: Router,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
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
        this.dialogRef.close();
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
    } else if (field === 'confirmNewPassword') {
      this.hideConfirmNewPassword = !this.hideConfirmNewPassword; // Added toggle for confirm password
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

  passwordsMatchValidator(control: AbstractControl) {
    const newPassword = control.parent?.get('newPassword')?.value;
    const confirmNewPassword = control.value;

    if (newPassword !== confirmNewPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }

  confirmNewPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const newPassword = this.changePasswordForm?.get('newPassword')?.value;
      const confirmPassword = control.value;

      if (newPassword !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  cancel() {
    this.dialogRef.close();
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      const dataToSend = {
        email: this.changePasswordForm.value.email,
        oldPassword: this.changePasswordForm.value.currentPassword,
        newPassword: this.changePasswordForm.value.newPassword,
        newPasswordConfirmation:
          this.changePasswordForm.value.confirmNewPassword,
      };
      this.userFacade.dispatchChangePassword(dataToSend);
      this.dialogRef.close();
    }
  }
}
