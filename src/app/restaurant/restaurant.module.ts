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
import { ActiveOrderListComponent } from './components/order/active-order-list/active-order-list.component';
import { OrderHistoryComponent } from './components/order/order-history/order-history.component';
import { RestaurantStaffComponent } from './components/restaurant-staff/restaurant-staff.component';
import { ActiveTableOrdersComponent } from './components/table/active-table-orders/active-table-orders.component';
import { AddItemToOrderComponent } from './components/table/add-item-to-order/add-item-to-order.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardState } from './store/dashboard/dashboard.state';
import { SettingsComponent } from './components/settings/settings.component';
import { DiscountTipDialogComponent } from './components/table/discount-tip-dialog/discount-tip-dialog.component';
import { CreditCardFormComponent } from './components/payment/credit-card-form/credit-card-form.component';
import { PaymentOptionFormComponent } from './components/payment/payment-option-form/payment-option-form.component';
import { DiscountFormComponent } from './components/payment/discount-form/discount-form.component';
import { EditOrderModalComponent } from './components/table/edit-order-modal/edit-order-modal.component';
import { CartModalComponent } from './components/menu/cart-modal/cart-modal.component';
import { CategoryManagerComponent } from './components/category-manager/category-manager.component';
import { MenuQrDialogComponent } from './components/menu-qr-dialog/menu-qr-dialog.component';

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
    OrdersComponent,
    ActiveOrderListComponent,
    OrderHistoryComponent,
    RestaurantStaffComponent,
    ActiveTableOrdersComponent,
    AddItemToOrderComponent,
    DashboardComponent,
    SettingsComponent,
    DiscountTipDialogComponent,
    CreditCardFormComponent,
    PaymentOptionFormComponent,
    DiscountFormComponent,
    EditOrderModalComponent,
    CartModalComponent,
    CategoryManagerComponent,
    MenuQrDialogComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule,
    NgxsModule.forFeature([
      RestaurantState,
      StockState,
      CategoryState,
      MenuState,
      OrderState,
      DashboardState,
    ]),
    FormsModule,
  ],
})
export class RestaurantModule {}
