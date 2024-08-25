import { Selector, createPropertySelectors } from '@ngxs/store';
import { MenuStateModel, MenuState } from './menu.state';

export class MenuSelector {
  static slices = createPropertySelectors<MenuStateModel>(MenuState);

  @Selector([MenuState])
  static categories(stateModel: MenuStateModel) {
    return stateModel.menus;
  }

}
