import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NgxsModule } from '@ngxs/store';

import { FormsModule } from '@angular/forms';
import { RestaurantListComponent } from './components/restaurant-list/restaurant-list.component';
import { UsersRoutingModule } from '../users/users-routing.module';
import { RestaurantState } from './store/restaurant.state';
import { RestaurantFormComponent } from './components/restaurant-form/restaurant-form.component';
import { RestaurantDetailComponent } from './components/restaurant-detail/restaurant-detail.component';

@NgModule({
  declarations: [
   RestaurantListComponent,
   RestaurantFormComponent,
   RestaurantDetailComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule,
    NgxsModule.forFeature([RestaurantState]),
    FormsModule,
  ],
})
export class RestaurantModule {}
