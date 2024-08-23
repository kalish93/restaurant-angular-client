import { Component, OnInit } from '@angular/core';
import { RestaurantFacade } from '../../facades/restaurant.facade';
import { RxState } from '@rx-angular/state';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from '../../models/restaurant.model';

interface RestaurantDetailComponentState {
  restaurant: Restaurant | null;
}

const initRestaurantDetailComponentState: Partial<RestaurantDetailComponentState> = {
  restaurant: null,
};

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrl: './restaurant-detail.component.scss'
})
export class RestaurantDetailComponent implements OnInit{

  $restaurant = this.state.select('restaurant');
  restaurant: Restaurant | null = null;
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role'];

  constructor(
    private restaurantFacade: RestaurantFacade,
    private state: RxState<RestaurantDetailComponentState>,
    private route: ActivatedRoute
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
}
