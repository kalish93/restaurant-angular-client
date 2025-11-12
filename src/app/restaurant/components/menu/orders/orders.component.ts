import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { combineLatest, map } from 'rxjs';
import { API_BASE_URL, MEDIA_URL } from 'src/app/core/constants/api-endpoints';
import { Restaurant } from 'src/app/restaurant/models/restaurant.model';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';

interface Order {
  id: any;
  number?: number;
  status: any;
  items: {
    menuItem: {
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    specialInstructions?: string;
  }[];
}

interface OrdersComponentState {
  myOrders: Order[];
  restaurant: Restaurant | undefined;
}

const initOrdersComponentState: OrdersComponentState = {
  myOrders: [],
  restaurant: undefined
};

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  $myOrders = this.state.select('myOrders');
  myOrders: Order[] = [];
  tableId: any;
  restaurant$ = this.state.select('restaurant');
  restaurant: Restaurant | undefined = undefined;

  constructor(
    private state: RxState<OrdersComponentState>,
    private orderFacade: OrderFacade,
    private route: ActivatedRoute,
    private restaurantFacade: RestaurantFacade
  ) {
    this.state.set(initOrdersComponentState);
    this.state.connect('myOrders', this.orderFacade.myTableOrders$);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$)
  }

  // ngOnInit(): void {
  //   this.route.paramMap.subscribe((params) => {
  //     this.tableId = params.get('tableId');
  //     const restaurantId = params.get('restaurantId');

  //     if (this.tableId) {
  //       this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
  //     } else {
  //       // Get restaurant orders when no table ID
  //      this.route.queryParamMap.subscribe((queryParams) => {
  //       const orderNumber = queryParams.get('orderNumber');
  //       if (orderNumber) {
  //         this.orderFacade.dispatchGetOrderByNumber(restaurantId, orderNumber);
  //       }
  //     });
  //     }
  //   });

  //   this.$myOrders.subscribe((data) => {
  //     this.myOrders = data;
  //   });
  // }

  ngOnInit(): void {
    // Combine route params and query params
    combineLatest([this.route.paramMap, this.route.queryParamMap])
      .pipe(
        map(([params, queryParams]) => {
          return {
            tableId: params.get('tableId'),
            restaurantId: params.get('restaurantId'),
            orderNumber: queryParams.get('orderNumber'),
          };
        })
      )
      .subscribe(({ tableId, restaurantId, orderNumber }) => {
        this.tableId = tableId;

        if (tableId) {
          this.orderFacade.dispatchGetActiveTableOrder(tableId);
        } else if (orderNumber) {
          this.orderFacade.dispatchGetOrderByNumber(restaurantId, orderNumber);
        }

        this.restaurantFacade.dispatchGetRestaurant(restaurantId);
        this.restaurant$.subscribe((data)=>{
          this.restaurant = data;
        })
      });

    // Subscribe to orders
    this.$myOrders.subscribe((data) => {
      this.myOrders = data;
    });
  }

  getTotalQuantity(items: any[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getOrderStatusName(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'READY':
        return 'Ready';
      case 'SERVED':
        return 'Served';
      case 'CANCELLED':
        return 'Cancelled';
      case 'PAID':
        return 'Paid';
      case 'PAYMENT_REQUESTED':
        return 'Payment Requested';
      default:
        return 'Unknown Status'; // Handle any unexpected status values
    }
  }

    getImageUrl(imagePath: string): string {
      return `${MEDIA_URL}/${imagePath}`;
    }

    getOrderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + (item.menuItem.price || 0) * item.quantity, 0);
}
}
