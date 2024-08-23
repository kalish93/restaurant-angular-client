import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from './components/stock/stock-list/stock-list.component';
import { STOCK_LIST } from '../core/constants/routes';

const routes: Routes = [
  {
    path: STOCK_LIST,
    component: StockListComponent,
    // children: [

    // ],
  },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {}
