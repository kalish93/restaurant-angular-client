import {
  Component,
  EventEmitter,
  Output,
  OnDestroy,
  OnInit,
  HostListener,
} from '@angular/core';
import { RxState } from '@rx-angular/state';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import {
  EMPLOYEES_LIST,
  ROLES_LIST,
  ROLES_ROUTE,
  USERS_LIST,
  ADMINS_LIST,
  RESTAURANT_LIST,
  MENU_LIST,
  TABLE_LIST,
  HOME_ROUTE,
  ORDER_HISTORY_ROUTE,
} from 'src/app/core/constants/routes';

import { jwtDecode } from 'jwt-decode';
import { Roles } from 'src/app/core/constants/roles';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { Subscription } from 'rxjs';
import { Restaurant } from '../../models/restaurant.model';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';

interface RestaurantHomeComponentState {
  accessToken: any;
  currentRestaurant: Restaurant | undefined;
}

const initRestaurantHomeComponentState: Partial<RestaurantHomeComponentState> =
  {
    accessToken: undefined,
    currentRestaurant: undefined,
  };

@Component({
  selector: 'app-home',
  templateUrl: './restaurant-home.component.html',
  styleUrls: ['./restaurant-home.component.scss'],
})
export class RestaurantHomeComponent implements OnDestroy, OnInit {
  navLinks: Array<{ link: string; label: string; icon: string }> = [];

  $accessToken = this.state.select('accessToken');
  $currentRestaurant = this.state.select('currentRestaurant');
  currentRestaurant: Restaurant | undefined;
  decoded: any;
  roleName: any;
  isOpen = true;
  isMobile = false;
  @Output() closeDrawer = new EventEmitter<void>();
  private sidenavSubscription!: Subscription;

  constructor(
    private authFacade: AuthFacade,
    private restaurantFacade: RestaurantFacade,
    private state: RxState<RestaurantHomeComponentState>,
    private sidenavService: SidenavService
  ) {
    this.state.set(initRestaurantHomeComponentState);
    this.state.connect('accessToken', this.authFacade.accessToken$);
    this.state.connect('currentRestaurant', this.restaurantFacade.selectedRestaurant$);
    this.$accessToken.subscribe((token) => {
      this.decoded = jwtDecode(token);
      this.roleName = this.decoded?.role?.name;
      this.setNavLinks(this.roleName);
    });

    this.$currentRestaurant.subscribe((restaurant) => {
      this.currentRestaurant = restaurant;
      console.log('Current restaurant:', this.currentRestaurant);
      // Recompute nav links when restaurant changes to apply subscription rules
      this.setNavLinks(this.roleName);
    });
    // Check initial screen size
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth < 768;

    // Auto-open sidenav on desktop, close on mobile
    if (this.isMobile) {
      this.isOpen = false;
    } else {
      this.isOpen = true;
    }
  }

  ngOnInit(): void {
    // Subscribe to sidenav toggle events
    this.sidenavSubscription = this.sidenavService.toggleSidenav$.subscribe(
      () => {
        console.log('Toggle sidenav event received');
        this.toggleDrawer();
      }
    );
  }

  // navLinks: Array<{ link: string; label: string; icon: string }> = [
  //   {
  //     link: RESTAURANT_LIST,
  //     label: 'Restaurants',
  //     icon: 'restaurant',
  //   },
  //   {
  //     link: TABLE_LIST,
  //     label: 'Tables',
  //     icon: 'table_chart',
  //   },
  //   {
  //     link: MENU_LIST,
  //     label: 'Menu',
  //     icon: 'menu_book',
  //   },
  //   {
  //     link: USERS_LIST,
  //     label: 'Users',
  //     icon: 'person',
  //   },
  // {
  //   link: ROLES_LIST,
  //   label: 'Roles',
  //   icon: '',
  // },
  // {
  //   link: EMPLOYEES_LIST,
  //   label: 'Employees',
  //   icon: '',
  // },
  // {
  //   link: ADMINS_LIST,
  //   label: 'Admins',
  //   icon: '',
  // },
  // ];

  setNavLinks(roleName: string): void {
    const subscription = (this.currentRestaurant as any)?.subscription;
    const isBasic = subscription === 'BASIC';
    const isStandard = subscription === 'STANDARD';

    if (roleName === 'Admin') {
      this.navLinks = [
        {
          link: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
        },
        {
          link: RESTAURANT_LIST,
          label: 'Restaurants',
          icon: 'restaurant',
        },
        {
          link: USERS_LIST,
          label: 'Users',
          icon: 'person',
        },
      ];
    } else if (roleName === Roles.RestaurantManager) {
      this.navLinks = [
        {
          link: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
        },
        // BASIC hides Tables
        ...(!isBasic && !isStandard
          ? [
              {
                link: TABLE_LIST,
                label: 'Tables',
                icon: 'table_chart',
              },
            ]
          : []),
        {
          link: MENU_LIST,
          label: 'Menu',
          icon: 'menu_book',
        },
        // BASIC hides Order History
        ...(!isBasic
          ? [
              {
                link: ORDER_HISTORY_ROUTE,
                label: 'Order History',
                icon: 'list',
              },
            ]
          : []),
        {
          link: 'staff',
          label: 'My Staff',
          icon: 'persons',
        },
        {
          link: 'settings',
          label: 'Settings',
          icon: 'settings',
        },
      ];
    } else {
      this.navLinks = [
        {
          link: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
        },
        // BASIC hides Tables
        ...(!isBasic && !isStandard
          ? [
              {
                link: TABLE_LIST,
                label: 'Tables',
                icon: 'table_chart',
              },
            ]
          : []),
        {
          link: MENU_LIST,
          label: 'Menu',
          icon: 'menu_book',
        },
        // BASIC hides Order History
        ...(!isBasic
          ? [
              {
                link: ORDER_HISTORY_ROUTE,
                label: 'Order History',
                icon: 'list',
              },
            ]
          : []),
      ];
    }
  }

  ngOnDestroy(): void {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }

  toggleDrawer() {
    console.log('Toggling drawer, current state:', this.isOpen);
    this.isOpen = !this.isOpen;
    console.log('New state:', this.isOpen);
  }

  getName() {
    this.currentRestaurant?.name;
  }

  onLogoError(event: any) {
    event.target.src = 'https://marketplace.canva.com/MADnuO9MlIU/1/thumbnail_large/canva-burger-icon-MADnuO9MlIU.png';
  }
}
