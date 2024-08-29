import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NgxsModule } from '@ngxs/store';

import { FormsModule } from '@angular/forms';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { UsersRoutingModule } from '../users/users-routing.module';
import { RestaurantState } from './store/restaurant.state';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';
import { AddRestaurantStaffComponent } from './components/add-restaurant-staff/add-restaurant-staff.component';
import { StockListComponent } from './components/stock/stock-list/stock-list.component';
import { StockState } from './store/stock/stock.state';
import { AddStockModalComponent } from './components/stock/add-stock-modal/add-stock-modal.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { TableListComponent } from './components/table/table-list/table-list.component';
import { TableFormComponent } from './components/table/table-form/table-form.component';
import { MenuListForUsersComponent } from './components/menu/menu-list-for-users/menu-list-for-users.component';
import { RestaurantHomeComponent } from './components/home/restaurant-home.component';
import { MenuFormComponent } from './components/menu-form/menu-form.component';
import { CategoryState } from './store/category/category.state';
import { MenuState } from './store/menu/menu.state';
import { StockSelectionComponent } from './components/menu/stock-selection/stock-selection.component';
import { CartComponent } from './components/menu/cart/cart.component';
import { OrderState } from './store/order/order.state';
import { OrdersComponent } from './components/menu/orders/orders.component';

@NgModule({
  declarations: [
   RestaurantListComponent,
   RestaurantFormComponent,
   RestaurantDetailComponent,
   AddRestaurantStaffComponent,
   StockListComponent,
   AddStockModalComponent,
   MenuListComponent,
   TableListComponent,
   TableFormComponent,
   MenuListForUsersComponent,
   RestaurantHomeComponent,
   MenuFormComponent,
   StockSelectionComponent,
   CartComponent,
   OrdersComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule,
    NgxsModule.forFeature([RestaurantState, StockState, CategoryState, MenuState, OrderState]),
    FormsModule,
  ],
})
export class RestaurantModule {}
