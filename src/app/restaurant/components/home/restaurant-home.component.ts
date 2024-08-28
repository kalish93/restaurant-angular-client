import { Component } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import {
  EMPLOYEES_LIST,
  ROLES_LIST,
  ROLES_ROUTE,
  USERS_LIST,
  ADMINS_LIST,
  RESTAURANT_LIST,
  STOCK_LIST,
  MENU_LIST,
  TABLE_LIST,
} from 'src/app/core/constants/routes';

import{ jwtDecode} from 'jwt-decode';

interface RestaurantHomeComponentState {
  accessToken: any;
}

const initRestaurantHomeComponentState: Partial<RestaurantHomeComponentState> = {
  accessToken: undefined,
};

@Component({
  selector: 'app-home',
  templateUrl: './restaurant-home.component.html',
  styleUrls: ['./restaurant-home.component.scss'],
})
export class RestaurantHomeComponent {
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
  //     link: STOCK_LIST,
  //     label: 'Stock',
  //     icon: 'local_bar',
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
    if (roleName === 'Admin') {
      this.navLinks = [
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
    } else {
      this.navLinks = [
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
      ];
    }
  }
}
