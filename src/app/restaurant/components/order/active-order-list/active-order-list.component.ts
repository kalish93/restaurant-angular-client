import { Component, OnInit } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Roles } from 'src/app/core/constants/roles';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';


interface ActiveOrderListComponentState {
  orders: any;
}

const initActiveOrderListComponentState: Partial<ActiveOrderListComponentState> = {
  orders: undefined,
};

@Component({
    selector: 'app-active-order-list',
    templateUrl: './active-order-list.component.html',
    styleUrl: './active-order-list.component.scss',
    standalone: false
})
export class ActiveOrderListComponent implements OnInit{

  orders$ = this.state.select('orders');
  orders: any[] = [];
  constructor(
    private orderFacade: OrderFacade,
    private state: RxState<ActiveOrderListComponentState>,
  ) {
    this.state.set(initActiveOrderListComponentState);
    this.state.connect('orders', this.orderFacade.activeOrders$);
  }

  ngOnInit(): void {
    this.orderFacade.dispatchGetActiveOrders();
    this.orders$.subscribe(data => {
      this.orders = data;
    });
  }

  viewDetails(orderId: string): void {
    // Logic to view order details, maybe navigate to another route or open a modal
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
}
