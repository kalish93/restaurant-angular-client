import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { Roles } from 'src/app/core/constants/roles';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { CreateOrderComponent } from '../create-order/create-order.component';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';


interface ActiveOrderListComponentState {
  orders: any;
  currentRestaurant: any;
}

const initActiveOrderListComponentState: Partial<ActiveOrderListComponentState> = {
  orders: undefined,
  currentRestaurant: undefined
};

@Component({
  selector: 'app-active-order-list',
  templateUrl: './active-order-list.component.html',
  styleUrl: './active-order-list.component.scss'
})
export class ActiveOrderListComponent implements OnInit{

  orders$ = this.state.select('orders');
  orders: any[] = [];
  currentRestaurant$ = this.state.select('currentRestaurant');
  currentRestaurant: any = undefined;

  constructor(
    private orderFacade: OrderFacade,
    private state: RxState<ActiveOrderListComponentState>,
    private router: Router,
    private dialog: MatDialog,
    private restaurantFacade: RestaurantFacade
  ) {
    this.state.set(initActiveOrderListComponentState);
    this.state.connect('orders', this.orderFacade.activeOrders$);
    this.state.connect('currentRestaurant', this.restaurantFacade.selectedRestaurant$);
  }

  ngOnInit(): void {
    this.orderFacade.dispatchGetActiveOrders();
    this.orders$.subscribe(data => {
      this.orders = data;
    });
    this.currentRestaurant$.subscribe(data => {
      this.currentRestaurant = data;
    });
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

  changeStatus(orderId: string, newStatus: string): void {
    const dataToSend = {
      id: orderId,
      newStatus: newStatus,
    }
    this.orderFacade.dispatchUpdateOrderStatus(dataToSend);
  }

  changeSubOrderStatus(orderId: string, newStatus: string, type: string): void {
    const dataToSend = {
      id: orderId,
      newStatus: newStatus,
      type: type
    }
    this.orderFacade.dispatchUpdateOrderStatus(dataToSend);
  }

  cancelOrder(orderId: string): void {
    // this.orderFacade.dispatchCancelOrder(orderId);
  }

  canChangeStatus(currentStatus: string, newStatus: string): boolean {
    const statusOrder = ['PENDING', 'IN_PROGRESS', 'READY', 'SERVED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = statusOrder.indexOf(newStatus);

    return currentIndex !== -1 && newIndex !== -1 && newIndex === currentIndex + 1;
  }

  hasManagerRole(){
    return Roles.RestaurantManager
  }

  hasBartenderRole(){
    return Roles.Bartender
  }

  hasKitchenRole(){
    return Roles.KitchenStaff
  }

  hasWaiterRole(){
    return Roles.Waiter
  }

  viewDetails(tableId: string, orderNumber: string, restaurantId: string): void {
    if(tableId){
    this.router.navigate(['/home', 'tables', tableId]);
    }else{
    this.router.navigate(['/home', 'order-detail', restaurantId, orderNumber]);
    }
  }

  openCreateOrderModal(){
  const dialogRef = this.dialog.open(CreateOrderComponent, {
    width: '400px',
    data: { restaurantId: this.currentRestaurant.id }
  });

  dialogRef.afterClosed().subscribe(result => {
    // if (result) {
    //   const dataToSend = {
    //     id: item.id,
    //     quantity: result.quantity,
    //     specialInstructions: result.specialInstructions
    //   };
    //   this.orderFacade.dispatchUpdateOrderItem(dataToSend, null, this.restaurantId, this.orderNumber);
    // }
  });


  }

}
