import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';
import { AddItemToOrderComponent } from '../add-item-to-order/add-item-to-order.component';
import { DiscountTipDialogComponent } from '../discount-tip-dialog/discount-tip-dialog.component';
import { PaymentOptionFormComponent } from '../../payment/payment-option-form/payment-option-form.component';
import { EditOrderModalComponent } from '../edit-order-modal/edit-order-modal.component';

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
      this.tableId = params.get('id');
      this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
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
      this.orderFacade.dispatchUpdateOrderItem(dataToSend, this.tableId);
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
      data: {orderId :orderId, tableId: this.tableId}
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
    this.orderFacade.dispatchGetActiveTableOrder(this.tableId);


    const dialogRef = this.dialog.open(PaymentOptionFormComponent, {
      width: '400px',
      data: { restaurantId: this.myOrders[0].restaurant.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const dataToSend = {
        orderIds: this.myOrders.flatMap(order => order.id),
        cashPaymentAmount: result.cashPaymentAmount,
        provider: result.provider,
        transferAmount: result.transferAmount
      }

    this.orderFacade.dispatchMarkAsPaid(dataToSend, this.tableId);
  }})
  }

  printBill() {
    const dialogRef = this.dialog.open(DiscountTipDialogComponent, {
      width: '400px',
      data: { totalAmount: this.getTotalForInvoice(), restaurantId: this.myOrders[0].restaurant.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { tipValue, discount, discountId } = result;

        // Calculate tip based on total amount before discount
        const totalBeforeDiscount = this.getTotalForInvoice();
        const tipAmount = totalBeforeDiscount * (tipValue / 100);

        // Calculate discount amount
        const discountAmount = totalBeforeDiscount * (discount / 100);
        const totalAfterDiscount = totalBeforeDiscount - discountAmount;

        // Calculate tax for each item based on its individual tax rate
        const taxAmount = this.combinedItems.reduce((taxTotal, item) => {
          return taxTotal + ((item.menuItem.price * item.quantity) * (item.menuItem.taxRate / 100));
        }, 0);

        const finalTotal = totalAfterDiscount + taxAmount + tipAmount;

        const dataToSend = {
          orderIds: this.myOrders.flatMap(order => order.id),
          discount: discountAmount,
          tipAmount: tipAmount,
          discountId: discountId
        };

        this.orderFacade.dispatchSaveTipAndDiscount(dataToSend);
        this.generatePrintableBill(finalTotal, tipAmount, discountAmount, taxAmount, tipValue);
      }
    });
  }

  generatePrintableBill(finalTotal: number, tipAmount: number, discount: number, taxAmount: number, tipPercentage: number) {
    const printableContent = `
      <div style="font-family: 'Courier New', Courier, monospace; width: 100%; padding: 10px; max-width: 80mm">
        <div style="text-align: center;">${this.myOrders[0].restaurant.name}</div>
        <hr/>
        <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
          <span>${this.getCurrentDate()}</span>
          <span>${this.getCurrentTime()}</span>
        </div>
        <hr/>
        ${this.combinedItems.map(item => `
          <div style="margin-bottom: 5px; display: flex; flex-direction: row; justify-content: space-between;">
            <span>${item.menuItem.name}</span>
            <span>${item.quantity} x ${item.menuItem.price}</span>
            <span>= ${(item.quantity * item.menuItem.price).toFixed(2)}</span>
          </div>
        `).join('')}
        <hr/>
        <div style="display: flex; justify-content: space-between;"><span>Total:</span><span>${this.getTotalForInvoice().toFixed(2)}</span></div>
        ${discount > 0 ? `
          <div style="display: flex; justify-content: space-between;"><span>Discount:</span><span>-${discount.toFixed(2)}</span></div>
        ` : ''}
        <div style="display: flex; justify-content: space-between;"><span>Tax:</span><span>${taxAmount.toFixed(2)}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Tip:</span><span>${this.getTotalForInvoice().toFixed(2)} x ${tipPercentage}%</span><span>${tipAmount.toFixed(2)}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Final Total:</span><span>${finalTotal.toFixed(2)}</span></div>
        <hr/>
        <p style="text-align: center; margin-top: 25px;">
          Thank you for dining with us!<br/>
          Please visit us again.
        </p>
      </div>
    `;

    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printableContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload()
  }

}
