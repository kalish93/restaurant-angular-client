import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import {
  CART_ROUTE,
  HOME_ROUTE,
  LOGIN_ROUTE,
  MENU_LIST,
  ORDER_HISTORY_ROUTE,
  RESTAURANT_LIST,
  STOCK_LIST,
  TABLE_LIST,
  USERS_LIST,
  USERS_ROUTE,
} from './core/constants/routes';
import { HomeComponent } from './home/home.component';
import { MenuListForUsersComponent } from './restaurant/components/menu/menu-list-for-users/menu-list-for-users.component';
import { RestaurantHomeComponent } from './restaurant/components/home/restaurant-home.component';
import { RestaurantListComponent } from './restaurant/components/restaurant-list/restaurant-list.component';
import { RestaurantDetailComponent } from './restaurant/components/restaurant-detail/restaurant-detail.component';
import { StockListComponent } from './restaurant/components/stock/stock-list/stock-list.component';
import { MenuListComponent } from './restaurant/components/menu-list/menu-list.component';
import { TableListComponent } from './restaurant/components/table/table-list/table-list.component';
import { UserListComponent } from './users/components/user-list/user-list.component';
import { CartComponent } from './restaurant/components/menu/cart/cart.component';
import { OrdersComponent } from './restaurant/components/menu/orders/orders.component';
import { ActiveOrderListComponent } from './restaurant/components/order/active-order-list/active-order-list.component';
import { OrderHistoryComponent } from './restaurant/components/order/order-history/order-history.component';
import { RestaurantStaffComponent } from './restaurant/components/restaurant-staff/restaurant-staff.component';


const routes: Routes = [
  { path: '', redirectTo: LOGIN_ROUTE, pathMatch: 'full' },
  { path: LOGIN_ROUTE, component: LoginComponent },
  { path: 'menu/:restaurantId/:tableId', component: MenuListForUsersComponent },
  { path: `${CART_ROUTE}/:restaurantId/:tableId`,
    component: CartComponent
    },
  { path: `orders/:restaurantId/:tableId`,
    component: OrdersComponent
    },


  // { path: 'home', component: ActiveOrderListComponent},

  { path: 'home', component: RestaurantHomeComponent,
    children:[
      {
        path: RESTAURANT_LIST,
        component: RestaurantListComponent,
      },
      {
        path: `${RESTAURANT_LIST}/:id`,
        component: RestaurantDetailComponent,
      },
      { path: ORDER_HISTORY_ROUTE, component: OrderHistoryComponent},

     { path: STOCK_LIST,
      component: StockListComponent
      },
     { path: MENU_LIST,
      component: MenuListComponent
      },
     { path: TABLE_LIST,
      component: TableListComponent
      },
     { path: USERS_LIST,
      component: UserListComponent
      },
     { path: 'staff',
      component: RestaurantStaffComponent
      },
      { path: 'dashboard', component: ActiveOrderListComponent},

    ]
   },


  {
    path: USERS_ROUTE,
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },

  { path: HOME_ROUTE, component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
