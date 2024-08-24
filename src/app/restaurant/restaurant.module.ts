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

@NgModule({
  declarations: [
   RestaurantListComponent,
   RestaurantFormComponent,
   RestaurantDetailComponent,
   AddRestaurantStaffComponent,
   StockListComponent,
   AddStockModalComponent,
   MenuListComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule,
    NgxsModule.forFeature([RestaurantState, StockState]),
    FormsModule,
  ],
})
export class RestaurantModule {}
