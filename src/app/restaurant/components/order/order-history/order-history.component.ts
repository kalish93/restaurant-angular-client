import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';

interface OrderHistoryComponentState {
  orders: any;
}

const initOrderHistoryComponentState: Partial<OrderHistoryComponentState> = {
  orders: undefined,
};

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['tableNumber', 'items', 'status', 'createdAt'];

  orders: any[] = [];
  pageSize = 10;
  pageNumber = 1;

  $orders = this.state.select('orders');

  constructor(
    private orderFacade: OrderFacade,
    private state: RxState<OrderHistoryComponentState>,
    private router: Router
  ) {
    this.state.set(initOrderHistoryComponentState);
    this.state.connect('orders', this.orderFacade.orderHistory$);
  }

  ngOnInit(): void {
    this.orderFacade.dispatchGetOrderHistory(this.pageNumber, this.pageSize);
    this.$orders.subscribe(data => {
      this.orders = data.items;
      this.pageNumber = data.pageNumber;
      this.pageSize = data.pageSize;
      this.paginator.length = data.totalCount;
    });
  }

  pageChanged(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.orderFacade.dispatchGetOrderHistory(this.pageNumber, this.pageSize);
  }

  navigateToDetail(orderId: string): void {
    this.router.navigate(['/home/orders', orderId]);
  }

  getStatusClasses(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'READY':
      return 'bg-purple-100 text-purple-800';
    case 'SERVED':
      return 'bg-green-100 text-green-800';
    case 'PAYMENT_REQUESTED':
      return 'bg-amber-100 text-amber-800';
    case 'PAID':
      return 'bg-green-100 text-green-700';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

}

