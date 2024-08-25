import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken, Store } from '@ngxs/store';
import { tap } from 'rxjs';
import { OperationStatusService } from 'src/app/core/services/operation-status/operation-status.service';
import { Category } from '../../models/category.model';
import { GetCategories } from './category.actions';
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

  @Action(GetCategories)
  getCategories(
    { setState }: StateContext<CategoryStateModel>,
    {}: GetCategories
  ) {
    console.log("the state");
    try{
      this.categoryService.getCategories().pipe(
        tap((result) => {
            setState({
              categories:result
            })
        })
      );
    }
    catch(error){
      console.error(error);
    }
  }

}
