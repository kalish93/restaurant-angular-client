import { Component } from '@angular/core';
import { Roles } from 'src/app/core/constants/roles';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  hasManagerRole(){
    return Roles.RestaurantManager
  }

  hasBartenderRole(){
    return Roles.Bartender
  }

  hasKitchenRole(){
    return Roles.KitchenStaff
  }

  hasWaiterRole(){
    return Roles.Waiter
  }
}
