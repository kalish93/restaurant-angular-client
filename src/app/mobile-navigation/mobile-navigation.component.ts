import { Component, EventEmitter, Output } from '@angular/core';
import { MENU_LIST, RESTAURANT_LIST, STOCK_LIST, TABLE_LIST, USERS_LIST } from '../core/constants/routes';

@Component({
  selector: 'app-mobile-navigation',
  templateUrl: './mobile-navigation.component.html',
  styleUrls: ['./mobile-navigation.component.scss']
})
export class MobileNavigationComponent {

  navLinks: Array<{ link: string; label: string; icon: string }> = [
    {
      link: `home/${RESTAURANT_LIST}`,
      label: 'Restaurants',
      icon: 'restaurant',
    },
    {
      link: `home/${TABLE_LIST}`,
      label: 'Tables',
      icon: 'table_chart',
    },
    {
      link: `home/${STOCK_LIST}`,
      label: 'Stock',
      icon: 'local_bar',
    },
    {
      link: `home/${MENU_LIST}`,
      label: 'Menu',
      icon: 'menu_book',
    },
    {
      link: USERS_LIST,
      label: 'Users',
      icon: 'person',
    },
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
  ];
  isOpen = false;

  @Output() closeDrawer = new EventEmitter<void>();

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    // this.closeDrawer.emit(); // Ensure this doesn't cause a recursion loop
  }
}
