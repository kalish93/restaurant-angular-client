import { Component } from '@angular/core';
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

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {
  navLinks: Array<{ link: string; label: string; icon: string }> = [
    {
      link: RESTAURANT_LIST,
      label: 'Restaurants',
      icon: 'restaurant',
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
      link: USERS_LIST,
      label: 'Users',
      icon: '',
    },
    {
      link: ROLES_LIST,
      label: 'Roles',
      icon: '',
    },
    {
      link: EMPLOYEES_LIST,
      label: 'Employees',
      icon: '',
    },
    {
      link: ADMINS_LIST,
      label: 'Admins',
      icon: '',
    },
  ];
}
