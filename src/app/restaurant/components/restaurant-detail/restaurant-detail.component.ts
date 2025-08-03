import { Component, OnInit } from '@angular/core';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { RxState } from '@rx-angular/state';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../../models/restaurant.model';
import { MatDialog } from '@angular/material/dialog';
import { AddRestaurantStaffComponent } from '../add-restaurant-staff/add-restaurant-staff.component';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';

interface RestaurantDetailComponentState {
  restaurant: Restaurant | null;
}

const initRestaurantDetailComponentState: Partial<RestaurantDetailComponentState> = {
  restaurant: null,
};

@Component({
    selector: 'app-restaurant-detail',
    templateUrl: './restaurant-detail.component.html',
    styleUrl: './restaurant-detail.component.scss',
    standalone: false
})
export class RestaurantDetailComponent implements OnInit{

  $restaurant = this.state.select('restaurant');
  restaurant: Restaurant | null = null;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'actions'];

  constructor(
    private restaurantFacade: RestaurantFacade,
    private state: RxState<RestaurantDetailComponentState>,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ){
    this.state.set(initRestaurantDetailComponentState);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const restaurantId = params.get('id');
      if (restaurantId) {
        this.restaurantFacade.dispatchGetRestaurant(restaurantId);
      }
    });

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

}
