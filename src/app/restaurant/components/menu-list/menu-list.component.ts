import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuFormComponent } from '../menu-form/menu-form.component';
import { RxState } from '@rx-angular/state';
import { MenuFacade } from '../../facades/menu.facade';
import { Menu } from '../../models/menu.model';


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
    this.menus$.subscribe(item=>this.menus = item);
  }
  menuItems = [
    {
      name: 'Spaghetti Carbonara',
      price: 12.99,
      description: 'Classic Italian pasta with creamy sauce and pancetta.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.zjwlkbRWoRIUP2nLduDtoAHaLI?pid=ImgDet&w=192&h=288&c=7&dpr=1.5'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.zjwlkbRWoRIUP2nLduDtoAHaLI?pid=ImgDet&w=192&h=288&c=7&dpr=1.5'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    {
      name: 'Margherita Pizza',
      price: 10.99,
      description: 'Fresh mozzarella, tomatoes, and basil on a thin crust.',
      imageUrl: 'https://th.bing.com/th/id/OIP.52oQgE8Dako4JWg31n1viAHaKi?rs=1&pid=ImgDetMain'
    },
    // Add more items as needed
  ];

  order(item: any): void {
    // Handle the order logic
    console.log(`Ordered: ${item.name}`);
  }
  openMenuModal(){
    this.dialog.open(MenuFormComponent,{
      width: "60%"
    })
  }
}
