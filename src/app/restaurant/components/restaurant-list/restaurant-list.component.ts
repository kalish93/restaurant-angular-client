import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RxState } from '@rx-angular/state';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  providers: [RxState]
})
export class RestaurantListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'isActive', 'createdDate'];
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

  navigateToDetail(restaurantId: string): void {
    this.router.navigate(['/restaurants', restaurantId]);
  }
}
