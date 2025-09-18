import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RxState } from '@rx-angular/state';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { OrderFacade } from 'src/app/restaurant/facades/order.facade';

interface AddItemToOrderComponentState {
  menu: any[];
}

const initAddItemToOrderComponentState: AddItemToOrderComponentState = {
  menu: []
};

@Component({
  selector: 'app-add-item-to-order',
  templateUrl: './add-item-to-order.component.html',
  styleUrl: './add-item-to-order.component.scss',
  providers: [RxState]
})
export class AddItemToOrderComponent implements OnInit{

  menuItemForm: FormGroup;
  menuItems: any[] = []; // You will populate this with your actual menu items

  menu$ = this.state.select('menu');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddItemToOrderComponent>,
    private menuFacade: MenuFacade,
    private state: RxState<AddItemToOrderComponentState>,
    private orderFacade: OrderFacade,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.state.set(initAddItemToOrderComponentState);
    this.state.connect('menu', this.menuFacade.menus$)
    this.menuItemForm = this.fb.group({
      menuItemId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      specialInstructions: ['']
    });

    this.loadMenuItems();
  }

  ngOnInit(): void {
    this.menuFacade.dispatchGetMenus();
    this.menu$.subscribe((menu)=>{
      this.menuItems = menu
    })
  }

  loadMenuItems() {
    // this.menuItemService.getMenuItems().subscribe(items => {
    //   this.menuItems = items;
    // });
  }

  onSubmit() {
    if (this.menuItemForm.valid) {
      this.orderFacade.dispatchAddOrderItem({
        orderId: this.data.orderId,
        ...this.menuItemForm.value
      }, this.data.tableId, this.data.restaurantId, this.data.orderNumber)
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
