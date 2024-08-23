import { Component, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { UserFacade } from '../../facade/user.facade';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LOGIN_ROUTE } from 'src/app/core/constants/routes';

interface ForgetPasswordComponentState {
  forgetPasswordSuccess: boolean;
}

const initForgetPasswordComponentState: Partial<ForgetPasswordComponentState> =
  {
    forgetPasswordSuccess: false,
  };

@Component({
  selector: 'forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss'],
  providers: [RxState],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  forgetPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  forgetPasswordSuccess$: Observable<boolean> = this.state.select(
    'forgetPasswordSuccess'
  );

  constructor(
    private fb: NonNullableFormBuilder,
    private userFacade: UserFacade,
    private state: RxState<ForgetPasswordComponentState>,
    private router: Router
  ) {
    this.state.set(initForgetPasswordComponentState);
    this.state.connect(
      'forgetPasswordSuccess',
      userFacade.isForgetPasswordSuccessful$
    );
  }

  ngOnInit(): void {
    this.forgetPasswordSuccess$.subscribe((result) => {
      if (result) {
        this.router.navigate([LOGIN_ROUTE]);
      }
    });
  }
  ngOnDestroy(): void {
    this.userFacade.dispatchResetForgetPasswordStatus();
  }

  forgetPassword() {
    const { valid, touched, dirty } = this.forgetPasswordForm;

    if (valid && (touched || dirty) && this.forgetPasswordForm.value.email) {
      this.userFacade.dispatchForgetPassword({
        email: this.forgetPasswordForm.value.email,
      });
    }
  }
}
