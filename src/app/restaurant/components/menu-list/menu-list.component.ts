import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuFormComponent } from '../menu-form/menu-form.component';
import { RxState } from '@rx-angular/state';
import { MenuFacade } from '../../facades/menu.facade';
import { Menu } from '../../models/menu.model';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { ConfirmDialogComponent } from 'src/app/shared/shared-components/confirm-dialog/confirm-dialog.component';


interface MenuState{
  menus: Menu[]
}

const initMenuState:MenuState = {
  menus:[]
}

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss',
  providers:[RxState]
})
export class MenuListComponent implements OnInit {

  menus: Menu[] = [];

menus$ = this.state.select('menus');
  constructor(private dialog: MatDialog, 
    private menuFacade: MenuFacade,
    private state: RxState<MenuState>){
    this.state.set(initMenuState);
    this.state.connect('menus', this.menuFacade.menus$);
  }
  ngOnInit(): void {
    this.menuFacade.dispatchGetMenus();
    this.menus$.subscribe(item=>this.menus = item);
  }
  
  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  order(item: Menu): void {
    // Handle the order logic
    console.log(`Ordered: ${item.name}`);
  }
  openMenuModal(){
    this.dialog.open(MenuFormComponent,{
      width: "60%"
    })
  }
  deleteMenuItem(item:Menu){
   const dialogRef = this.dialog.open(ConfirmDialogComponent,{
      data:{
        message: "Are you sure? "
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.menuFacade.dispatchDeleteMenu(item.id);
      } 
    this.dialog.closeAll();
    });
  }
  editMenuItem(item:Menu){
    this.dialog.open(MenuFormComponent,{
      data: item
    });
  }
}
