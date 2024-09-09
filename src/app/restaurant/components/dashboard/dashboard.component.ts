import { Component, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Roles } from 'src/app/core/constants/roles';
import { DashboardFacade } from '../../facades/dashboard.facade';

interface DashboardComponentState {
  numberOfAdmins: number;
  numberOfRestaurants: number;
  numberOfRestaurantStaff: number;
}

const initDashboardComponentState: DashboardComponentState = {
  numberOfAdmins: 0,
  numberOfRestaurants: 0,
  numberOfRestaurantStaff: 0,
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit{

  numberOfAdmins$ = this.state.select('numberOfAdmins');
  numberOfRestaurants$ = this.state.select('numberOfRestaurants');
  numberOfRestaurantStaff$ = this.state.select('numberOfRestaurantStaff');

  numberOfAdmins = 0;
  numberOfRestaurants = 0;
  numberOfRestaurantStaff = 0;

  constructor(
    private state: RxState<DashboardComponentState>,
    private dashboardFacade: DashboardFacade
  ) {
    this.state.set(initDashboardComponentState);
    this.state.connect('numberOfAdmins', this.dashboardFacade.numberOfAdmins$);
    this.state.connect('numberOfRestaurants', this.dashboardFacade.numberOfRestaurants$);
    this.state.connect('numberOfRestaurantStaff', this.dashboardFacade.numberOfRestaurantStaff$);
  }

  ngOnInit(): void {
    this.dashboardFacade.dispatchGetNumberOfAdmins();
    this.dashboardFacade.dispatchGetNumberOfRestaurants();
    this.dashboardFacade.dispatchGetNumberOfRestaurantStaff();

    this.numberOfAdmins$.subscribe((data)=>{
      this.numberOfAdmins = data;
    })
    this.numberOfRestaurants$.subscribe((data)=>{
      this.numberOfRestaurants = data;
    })
    this.numberOfRestaurantStaff$.subscribe((data)=>{
      this.numberOfRestaurantStaff = data;
    })
  }

  hasManagerRole() {
    return Roles.RestaurantManager;
  }

  hasBartenderRole() {
    return Roles.Bartender;
  }

  hasKitchenRole() {
    return Roles.KitchenStaff;
  }

  hasWaiterRole() {
    return Roles.Waiter;
  }
}
