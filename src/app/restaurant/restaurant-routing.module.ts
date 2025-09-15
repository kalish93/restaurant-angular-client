import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from './components/stock/stock-list/stock-list.component';

const routes: Routes = [

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {}
