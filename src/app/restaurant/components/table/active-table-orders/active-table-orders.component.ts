import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { AddItemToOrderComponent } from '../add-item-to-order/add-item-to-order.component';

interface OrdersComponentState {
  myOrders: any[];
}

const initOrdersComponentState: OrdersComponentState = {
  myOrders: []
};

@Component({
  selector: 'app-active-table-orders',
  templateUrl: './active-table-orders.component.html',
  styleUrl: './active-table-orders.component.scss'
})
export class ActiveTableOrdersComponent implements OnInit {
  $myOrders = this.state.select('myOrders');
  myOrders: any[] = [];
  tableId: any;
  editQuantity: boolean = false;

  constructor(
    private state: RxState<OrdersComponentState>,
    private orderFacade: OrderFacade,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.state.set(initOrdersComponentState);
    this.state.connect('myOrders', this.orderFacade.myTableOrders$);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tableId = params.get('id');
      this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
    });

    this.$myOrders.subscribe((data) => {
      this.myOrders = data;
      console.log(data[0].items)
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

  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  updateQuantity(item: any, event: any): void {
    const newQuantity = event.target.value;
    if (newQuantity > 0) {
      item.quantity = newQuantity;

    }
  }

  confirmUpdateQuantity(item: any): void {

    const dataToSend = {
      id: item.id,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions
    }

    this.orderFacade.dispatchUpdateOrderItem(dataToSend, this.tableId);
    this.editQuantity = false;
    item.showInstructions = false;
  }

  toggleEdit( item: any): void {
    this.editQuantity = true;
    item.showInstructions = true;
  }

  removeItem(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Are you sure you want to remove this item from the order?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirm') {
        this.orderFacade.dispatchRemoveOrderItem(item.id, this.tableId);
      }
      this.dialog.closeAll();
    });
  }



  getTotal(item: any) {
    return item.reduce((total: number, item: { menuItem: { price: number; }; quantity: number; }) => total + (item.menuItem.price * item.quantity), 0);
  }

  openAddMenuItemModal(orderId: any) {
    const dialogRef = this.dialog.open(AddItemToOrderComponent, {
      width: '400px',
      data: {orderId :orderId, tableId: this.tableId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result here (e.g., add the item to a list or submit to server)
        console.log('Menu item added:', result);
      }
    });
  }

}
