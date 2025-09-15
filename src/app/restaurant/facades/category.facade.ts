import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { CategorySelector } from '../store/category/category.selectors';
import { CreateCategory, DeleteCategory, GetCategoriesByRestaurant, UpdateCategory } from '../store/category/category.actions';


@Injectable({
  providedIn: 'root',
})
export class CategoryFacade {
  categories$: Observable<Category[]> = this.store.select(CategorySelector.slices.categories);

  constructor(private store: Store) {}

  dispatchGetCategoriesByRestaurant(restaurantId: string) {
    this.store.dispatch(new GetCategoriesByRestaurant(restaurantId));
  }

  dispatchCreateCategory(name: string, restaurantId: string){
    this.store.dispatch(new CreateCategory({ name, restaurantId }));
  }

  dispatchUpdateCategory(id: string, name: string, restaurantId: string){
    this.store.dispatch(new UpdateCategory(id, { name, restaurantId }));
  }

  dispatchDeleteCategory(id: string){
    this.store.dispatch(new DeleteCategory(id));
  }
}
