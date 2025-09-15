import { Component, EventEmitter, Output } from '@angular/core';
import { MENU_LIST, ORDER_HISTORY_ROUTE, RESTAURANT_LIST, TABLE_LIST, USERS_LIST } from '../core/constants/routes';
import { AuthFacade } from '../auth/facade/auth.facade';
import { RxState } from '@rx-angular/state';
import{ jwtDecode} from 'jwt-decode';
import { Roles } from '../core/constants/roles';
import { RestaurantFacade } from '../restaurant/facades/restaurant.facade';
import { Restaurant } from '../restaurant/models/restaurant.model';

interface RestaurantHomeComponentState {
  accessToken: any;
  currentRestaurant: Restaurant | undefined;
}

const initRestaurantHomeComponentState: Partial<RestaurantHomeComponentState> = {
  accessToken: undefined,
  currentRestaurant: undefined,
};

@Component({
  selector: 'app-mobile-navigation',
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss']
})
export class MobileNavigationComponent  {
  navLinks: Array<{ link: string; label: string; icon: string }> = [];

  $accessToken = this.state.select('accessToken');
  $currentRestaurant = this.state.select('currentRestaurant');
  decoded :any;
  roleName: any;
  constructor(
    private authFacade: AuthFacade,
    private state: RxState<RestaurantHomeComponentState>,
    private restaurantFacade: RestaurantFacade
  ){
    this.state.set(initRestaurantHomeComponentState);
    this.state.connect('accessToken', this.authFacade.accessToken$);
    this.state.connect('currentRestaurant', this.restaurantFacade.selectedRestaurant$);
    this.$accessToken.subscribe((token)=>{
       this.decoded = jwtDecode(token);
       this.roleName = this.decoded?.role?.name;
       this.setNavLinks(this.roleName);
    })

    this.$currentRestaurant.subscribe(()=>{
      this.setNavLinks(this.roleName);
    })
  }


  isOpen = false;

  @Output() closeDrawer = new EventEmitter<void>();
  setNavLinks(roleName: string): void {
    const subscription = (this.state.get('currentRestaurant') as any)?.subscription;
    const isBasic = subscription === 'BASIC';
    if (roleName === 'Admin') {
      this.navLinks = [
        {
          link: 'home/dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
        },
        {
          link: 'home/restaurants',
          label: 'Restaurants',
          icon: 'restaurant',
        },
        {
          link: `home/${USERS_LIST}`,
          label: 'Users',
          icon: 'person',
        },
      ];
    }else if (roleName === Roles.RestaurantManager){
      this.navLinks = [
        {
          link: 'home/dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
        },
        // BASIC hides Tables
        ...(!isBasic ? [{ link: `home/${TABLE_LIST}`, label: 'Tables', icon: 'table_chart' }] : []),
        {
          link: `home/${MENU_LIST}`,
          label: 'Menu',
          icon: 'menu_book',
        },
        // BASIC hides Order History
        ...(!isBasic ? [{ link: `home/${ORDER_HISTORY_ROUTE}`, label: 'Order History', icon: 'list' }] : []),
        {
          link:  'home/staff',
          label: 'My Staff',
          icon: 'persons',
        },
        {
          link:  'home/settings',
          label: 'Settings',
          icon: 'settings',
        },
      ];

    }else{
      this.navLinks = [
        {
          link: 'home/dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
        },
        // BASIC hides Tables
        ...(!isBasic ? [{ link: `home/${TABLE_LIST}`, label: 'Tables', icon: 'table_chart' }] : []),
        {
          link: `home/${MENU_LIST}`,
          label: 'Menu',
          icon: 'menu_book',
        },
        // BASIC hides Order History
        ...(!isBasic ? [{ link: `home/${ORDER_HISTORY_ROUTE}`, label: 'Order History', icon: 'list' }] : []),
      ];
    }

  }


  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    // this.closeDrawer.emit(); // Ensure this doesn't cause a recursion loop
  }
}
