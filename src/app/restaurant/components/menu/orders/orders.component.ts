import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';

interface Order {
  id: number;
  status: any;
  items: {
    menuItem: {
      name: string;
    };
    quantity: number;
  }[];
}

interface OrdersComponentState {
  myOrders: Order[];
}

const initOrdersComponentState: OrdersComponentState = {
  myOrders: []
};

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  $myOrders = this.state.select('myOrders');
  myOrders: Order[] = [];
  tableId: any;

  constructor(
    private state: RxState<OrdersComponentState>,
    private orderFacade: OrderFacade,
    private route: ActivatedRoute
  ) {
    this.state.set(initOrdersComponentState);
    this.state.connect('myOrders', this.orderFacade.myTableOrders$);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tableId = params.get('tableId');
      this.orderFacade.dispatchGetActiveTableOrder(this.tableId);
    });

    this.$myOrders.subscribe((data) => {
      this.myOrders = data;
    });
  }
}
