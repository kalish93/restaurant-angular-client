import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../models/restaurant.model';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { RxState } from '@rx-angular/state';
import { MatDialog } from '@angular/material/dialog';
import { AddRestaurantStaffComponent } from '../add-restaurant-staff/add-restaurant-staff.component';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import{ jwtDecode} from 'jwt-decode';
import { Roles } from 'src/app/core/constants/roles';

interface RestaurantDetailComponentState {
  restaurant: Restaurant | null;
  accessToken: any;
}

const initRestaurantDetailComponentState: Partial<RestaurantDetailComponentState> = {
  restaurant: null,
  accessToken: null,
};


@Component({
  selector: 'app-restaurant-staff',
  templateUrl: './restaurant-staff.component.html',
  styleUrl: './restaurant-staff.component.scss'
})
export class RestaurantStaffComponent implements OnInit{

  $restaurant = this.state.select('restaurant');
  restaurant: Restaurant | null = null;
  accessToken$ = this.state.select('accessToken');
  decoded: any | null = null;
  restaurantId: any | null = null;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions'];

  constructor(
    private restaurantFacade: RestaurantFacade,
    private state: RxState<RestaurantDetailComponentState>,
    private dialog: MatDialog,
    private authFacade: AuthFacade
  ){
    this.state.set(initRestaurantDetailComponentState);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$);
    this.state.connect('accessToken', this.authFacade.accessToken$);
  }

  ngOnInit(): void {

    this.accessToken$.subscribe((data)=>{
      this.decoded = jwtDecode(data);
       this.restaurantId = this.decoded?.restaurantId;
       this.restaurantFacade.dispatchGetRestaurant(this.restaurantId);
      })


    this.$restaurant.subscribe(restaurant => {
      this.restaurant = restaurant;
    });
  }

  openAddStaffDialog(): void {
    const dialogRef = this.dialog.open(AddRestaurantStaffComponent, {
      width: '400px',
      data: { restaurantId: this.restaurant?.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  openEditStaffDialog(user: any): void {
    const dialogRef = this.dialog.open(AddRestaurantStaffComponent, {
      width: '400px',
      data: { restaurantId: this.restaurant?.id, user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle any additional actions after closing the dialog
      }
    });
  }

  deleteStaff(user: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this staff?'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'confirm') {
        this.restaurantFacade.dispatchDeleteRestaurantStaff(user.id);
      }
    });
  }

  hasManagerRole(){
    return Roles.RestaurantManager
  }
}
