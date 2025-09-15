import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { OperationStatusService } from 'src/app/core/services/operation-status/operation-status.service';
import { Category } from '../../models/category.model';
import { CreateCategory, DeleteCategory, GetCategoriesByRestaurant, UpdateCategory } from './category.actions';
import { CategoryService } from '../../services/category.service';

export interface CategoryStateModel {
  categories: Category[];
}

const CATEGORY_STATE_TOKEN = new StateToken<CategoryStateModel>(
  'CategoryState'
);

const defaults: CategoryStateModel = {
  categories:[]
};

@State<CategoryStateModel>({
  name: CATEGORY_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class CategoryState {
  constructor(
    private categoryService: CategoryService,
    private operationStatus: OperationStatusService,
    private store: Store
  ) {}

  @Action(GetCategoriesByRestaurant)
  getCategoriesByRestaurant(
    { setState }: StateContext<CategoryStateModel>,
    { restaurantId }: GetCategoriesByRestaurant
  ) {
    return this.categoryService.getCategoriesByRestaurant(restaurantId).pipe(
      tap((result) => {
        setState({
          categories: result
        });
      })
    );
  }

  @Action(CreateCategory)
  createCategory(
    { setState, getState }: StateContext<CategoryStateModel>,
    { payload }: CreateCategory
  ) {
    return this.categoryService.createCategory(payload).pipe(
      tap((created) => {
        const state = getState();
        setState({
          categories: [...state.categories, created]
        });
      })
    );
  }

  @Action(UpdateCategory)
  updateCategory(
    { setState, getState }: StateContext<CategoryStateModel>,
    { id, payload }: UpdateCategory
  ) {
    return this.categoryService.updateCategory(id, payload).pipe(
      tap((updated) => {
        const state = getState();
        setState({
          categories: state.categories.map(c => c.id === id ? updated : c)
        });
      })
    );
  }

  @Action(DeleteCategory)
  deleteCategory(
    { setState, getState }: StateContext<CategoryStateModel>,
    { id }: DeleteCategory
  ) {
    return this.categoryService.deleteCategory(id).pipe(
      tap(() => {
        const state = getState();
        setState({
          categories: state.categories.filter(c => c.id !== id)
        });
      })
    );
  }
}
