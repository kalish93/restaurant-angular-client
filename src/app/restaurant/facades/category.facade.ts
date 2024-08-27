import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RestaurantSelector } from '../store/restaurant.selectors';
import { AddRestaurantStaff, CreateRestaurant, GetRestaurant, GetRestaurants } from '../store/restaurant.actions';
import { Category } from '../models/category.model';
import { GetCategories } from '../store/category/category.actions';
import { CategorySelector } from '../store/category/category.selectors';


@Injectable({
  providedIn: 'root',
})
export class CategoryFacade {
  categories$: Observable<Category[]> = this.store.select(CategorySelector.slices.categories);

  constructor(private store: Store) {}

  dispatchGetCategories() {
    this.store.dispatch(new GetCategories());
  }
}
