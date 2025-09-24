import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API_BASE_URL, MEDIA_URL } from 'src/app/core/constants/api-endpoints';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { PaymentOptionFormComponent } from '../../payment/payment-option-form/payment-option-form.component';
import { EditOrderModalComponent } from '../../table/edit-order-modal/edit-order-modal.component';
import { AddItemToOrderComponent } from '../../table/add-item-to-order/add-item-to-order.component';

interface OrdersComponentState {
  myOrders: any[];
}

const initOrdersComponentState: OrdersComponentState = {
  myOrders: []
};

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent  implements OnInit {
  $myOrders = this.state.select('myOrders');
  myOrders: any[] = [];
  orderNumber: any;
  restaurantId: any;
  editQuantity: boolean = false;
  combinedItems: any[] = []

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
      this.orderNumber = params.get('orderNumber');
      this.restaurantId = params.get('restaurantId');
      this.orderFacade.dispatchGetOrderByNumber(this.restaurantId, this.orderNumber);
    });

    this.$myOrders.subscribe((data) => {
      this.myOrders = data;
      this.combineItemsForReceipt();
    });
  }

  combineItemsForReceipt() {
    // Combine all items from the orders into a single array
    this.combinedItems = this.myOrders.flatMap(order => order.items);
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

    this.orderFacade.dispatchUpdateOrderItem(dataToSend, null, this.restaurantId, this.orderNumber);
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
        this.orderFacade.dispatchRemoveOrderItem(item.id, null, this.restaurantId, this.orderNumber);
      }
      this.dialog.closeAll();
    });
  }
openEditModal(item: any) {
  const dialogRef = this.dialog.open(EditOrderModalComponent, {
    width: '400px',
    data: { item }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const dataToSend = {
        id: item.id,
        quantity: result.quantity,
        specialInstructions: result.specialInstructions
      };
      this.orderFacade.dispatchUpdateOrderItem(dataToSend, null, this.restaurantId, this.orderNumber);
    }
  });
}

onImageError(event: any) {
    event.target.src = 'https://placehold.co/600x400?text=Menu+Image';
  }

  getTotal(item: any) {
    return item.reduce((total: number, item: { menuItem: { price: number; }; quantity: number; }) => total + (item.menuItem.price * item.quantity), 0);
  }

  getTotalForInvoice() {
    return this.combinedItems.reduce((total: number, item: { menuItem: { price: number; }; quantity: number; }) => total + (item.menuItem.price * item.quantity), 0);
  }

  openAddMenuItemModal(orderId: any) {
    const dialogRef = this.dialog.open(AddItemToOrderComponent, {
      width: '400px',
      data: {orderId :orderId, tableId: null, restaurantId: this.restaurantId, orderNumber: this.orderNumber}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result here (e.g., add the item to a list or submit to server)
      }
    });
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleDateString(); // Format the date
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString(); // Format the time
  }

  markAsPaid(){
    // const dataToSend = {
    //   orderIds: this.myOrders.flatMap(order => order.id)
    // }
    // this.orderFacade.dispatchMarkAsPaid(dataToSend, this.tableId);
    this.orderFacade.dispatchGetOrderByNumber(this.restaurantId, this.orderNumber);


    const dialogRef = this.dialog.open(PaymentOptionFormComponent, {
      width: '400px',
      data: { restaurantId: this.restaurantId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const dataToSend = {
        orderIds: this.myOrders.flatMap(order => order.id),
        cashPaymentAmount: result.cashPaymentAmount,
        provider: result.provider,
        transferAmount: result.transferAmount
      }

    this.orderFacade.dispatchMarkAsPaid(dataToSend, null, this.restaurantId, this.orderNumber);
  }})
  }
}
