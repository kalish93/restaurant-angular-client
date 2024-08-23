import { Component } from '@angular/core';
import {
  EMPLOYEES_LIST,
  ROLES_LIST,
  ROLES_ROUTE,
  USERS_LIST,
  ADMINS_LIST,
} from 'src/app/core/constants/routes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  navLinks: Array<{ link: string; label: string; icon: string }> = [
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
