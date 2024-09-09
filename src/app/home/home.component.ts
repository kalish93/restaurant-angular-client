import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  LOGIN_ROUTE,
  USERS_ROUTE,
  CHANGE_PASSWORD_ROUTE,
  BEFORE_LOGIN_ROUTE,
  STAFF_ROUTE,
  CART_ROUTE,
} from 'src/app/core/constants/routes';
import { AuthFacade } from '../auth/facade/auth.facade';
import { first } from 'rxjs/operators';

interface HomeComponentState {
  isAuthenticated: boolean;
}

const initHomeComponentState: Partial<HomeComponentState> = {
  isAuthenticated: true,
};

import { MobileNavigationComponent } from '../mobile-navigation/mobile-navigation.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RxState],
})
export class HomeComponent implements OnInit {
  accountManagement = {
    link: USERS_ROUTE,
    label: `users`,
    icon: `account_circle`,
  };


  loginRoute = {
    link: LOGIN_ROUTE,
    label: `Login`,
    icon: '',
  };

  logoutRoute = {
    link: '',
    label: `Logout`,
    icon: '',
  };

  changePasswordRoute = {
    link: `home/${CHANGE_PASSWORD_ROUTE}`,
    label: 'Change Password',
    icon: '',
  };
  isOnSpecificPage: boolean = false;

  isAuthenticated$: Observable<boolean> = this.state.select('isAuthenticated');
  isAuthenticated: any;
  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private state: RxState<HomeComponentState>,
    private matDialog: MatDialog
  ) {
    this.state.set(initHomeComponentState);
    this.state.connect('isAuthenticated', authFacade.isAuthenticated$);
  }
  @ViewChild('mobileNav') mobileNav!: MobileNavigationComponent;

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
          // !isAuthenticated && this.router.navigate(['/']);
          this.isAuthenticated = isAuthenticated
    });
    // this.isAuthenticated$
    //   .pipe(first())
    //   .subscribe((isAuthenticated) => {
    //     const currentUrl = this.router.url;

    //     if (!isAuthenticated && currentUrl !== BEFORE_LOGIN_ROUTE) {
    //       this.router.navigate([BEFORE_LOGIN_ROUTE]);
    //       this.logout()
    //     } else if (isAuthenticated && currentUrl !== STAFF_ROUTE) {
    //       this.router.navigate([STAFF_ROUTE]);
    //     }
    //   });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkUrl();
      }
    });

    // Check the URL when the component initializes
    this.checkUrl();
  }

  checkUrl(): void {
    const currentUrl = this.router.url;
    const menuPattern = /^\/menu\/[a-z0-9-]+\/[a-z0-9-]+$/i;
    const cartPattern = /^\/cart\/[a-z0-9-]+\/[a-z0-9-]+$/i;
    const orderPattern = /^\/orders\/[a-z0-9-]+\/[a-z0-9-]+$/i;

    this.isOnSpecificPage = menuPattern.test(currentUrl) || cartPattern.test(currentUrl) || orderPattern.test(currentUrl);
  }

  logout() {
    this.authFacade.dispatchLogout();
    this.router.navigate([LOGIN_ROUTE]);
  }


  openMobileNavigation() {
    if (this.mobileNav) {
      this.mobileNav.open();
    }
  }

  onDrawerClose() {
    if (this.mobileNav) {
      this.mobileNav.close();
    }
  }
}
