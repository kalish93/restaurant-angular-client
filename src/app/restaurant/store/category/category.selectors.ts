import { Selector, createPropertySelectors } from '@ngxs/store';
import { CategoryState, CategoryStateModel } from './category.state';

export class CategorySelector {
  static slices = createPropertySelectors<CategoryStateModel>(CategoryState);

  @Selector([CategoryState])
  static categories(stateModel: CategoryStateModel) {
    return stateModel.categories;
  }

}
