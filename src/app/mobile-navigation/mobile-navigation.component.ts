import { Component, EventEmitter, Output } from '@angular/core';
import { MENU_LIST, ORDER_HISTORY_ROUTE, RESTAURANT_LIST, STOCK_LIST, TABLE_LIST, USERS_LIST } from '../core/constants/routes';
import { AuthFacade } from '../auth/facade/auth.facade';
import { RxState } from '@rx-angular/state';
import{ jwtDecode} from 'jwt-decode';
import { Roles } from '../core/constants/roles';

interface RestaurantHomeComponentState {
  accessToken: any;
}

const initRestaurantHomeComponentState: Partial<RestaurantHomeComponentState> = {
  accessToken: undefined,
};

@Component({
  selector: 'app-mobile-navigation',
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss']
})
export class MobileNavigationComponent  {
  navLinks: Array<{ link: string; label: string; icon: string }> = [];

  $accessToken = this.state.select('accessToken');
  decoded :any;
  roleName: any;
  constructor(
    private authFacade: AuthFacade,
    private state: RxState<RestaurantHomeComponentState>
  ){
    this.state.set(initRestaurantHomeComponentState);
    this.state.connect('accessToken', this.authFacade.accessToken$);
    this.$accessToken.subscribe((token)=>{
       this.decoded = jwtDecode(token);
       this.roleName = this.decoded?.role?.name;
       this.setNavLinks(this.roleName);
    })
  }


  isOpen = false;

  @Output() closeDrawer = new EventEmitter<void>();
  setNavLinks(roleName: string): void {
    if (roleName === 'Admin') {
      this.navLinks = [
        // {
        //   link: 'dashboard',
        //   label: 'Dashboard',
        //   icon: 'dashboard',
        // },
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
    }else if (roleName === Roles.RestaurantManager){
      this.navLinks = [
        {
          link: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
        },
        {
          link: TABLE_LIST,
          label: 'Tables',
          icon: 'table_chart',
        },
        {
          link: STOCK_LIST,
          label: 'Stock',
          icon: 'local_bar',
        },
        {
          link: MENU_LIST,
          label: 'Menu',
          icon: 'menu_book',
        },
        {
          link:  ORDER_HISTORY_ROUTE,
          label: 'Order History',
          icon: 'list',
        },
        {
          link:  'staff',
          label: 'My Staff',
          icon: 'persons',
        },
      ];

    }else{
      this.navLinks = [
        {
          link: 'dashboard',
          label: 'Dashboard',
          icon: 'dashboard',
        },
        {
          link: TABLE_LIST,
          label: 'Tables',
          icon: 'table_chart',
        },
        {
          link: STOCK_LIST,
          label: 'Stock',
          icon: 'local_bar',
        },
        {
          link: MENU_LIST,
          label: 'Menu',
          icon: 'menu_book',
        },
        {
          link:  ORDER_HISTORY_ROUTE,
          label: 'Order History',
          icon: 'list',
        },
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
