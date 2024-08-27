import { Selector, createPropertySelectors } from '@ngxs/store';
import { MenuStateModel, MenuState } from './menu.state';

export class MenuSelector {
  static slices = createPropertySelectors<MenuStateModel>(MenuState);

  @Selector([MenuState])
  static menus(stateModel: MenuStateModel) {
    return stateModel.menus;
  }

}
