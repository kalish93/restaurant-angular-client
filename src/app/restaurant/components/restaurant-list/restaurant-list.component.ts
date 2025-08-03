import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RxState } from '@rx-angular/state';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';

interface RestaurantListComponentState {
  restaurants: any;
}

const initRestaurantListComponentState: Partial<RestaurantListComponentState> = {
  restaurants: undefined,
};

@Component({
    selector: 'app-restaurant-list',
    templateUrl: './restaurant-list.component.html',
    styleUrls: ['./restaurant-list.component.scss'],
    providers: [RxState],
    standalone: false
})
export class RestaurantListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'isActive', 'createdDate', 'actions'];
  restaurants: any[] = [];
  pageSize = 10;
  pageNumber = 1;

  $restaurants = this.state.select('restaurants');

  constructor(
    private restaurantFacade: RestaurantFacade,
    private state: RxState<RestaurantListComponentState>,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.state.set(initRestaurantListComponentState);
    this.state.connect('restaurants', this.restaurantFacade.restaurants$);
  }

  ngOnInit(): void {
    this.restaurantFacade.dispatchGetRestaurants(this.pageNumber, this.pageSize);
    this.$restaurants.subscribe(data => {
      this.restaurants = data.items;
      this.pageNumber = data.pageNumber;
      this.pageSize = data.pageSize;
      this.paginator.length = data.totalCount;
    });
  }

  pageChanged(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.restaurantFacade.dispatchGetRestaurants(this.pageNumber, this.pageSize);
  }

  openAddRestaurantDialog(): void {
    const dialogRef = this.dialog.open(RestaurantFormComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  openEditRestaurantDialog(restaurant: any, event: Event): void {
    event.stopPropagation(); // Prevent navigation to detail
    const dialogRef = this.dialog.open(RestaurantFormComponent, {
      width: '400px',
      data: { restaurant }  // Pass the restaurant data for editing
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  deleteRestaurant(restaurantId: string, event: Event): void {
    event.stopPropagation(); // Prevent navigation to detail
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to delete this restaurant?'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'confirm') {
        this.restaurantFacade.dispatchDeleteRestaurant(restaurantId);
      }
    });
  }

  navigateToDetail(restaurantId: string): void {
    this.router.navigate(['/home/restaurants', restaurantId]);
  }
}
