import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';
import { MenuFacade } from 'src/app/restaurant/facades/menu.facade';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';
import { Menu } from 'src/app/restaurant/models/menu.model';

interface MenuListForUsersComponentState {
  restaurant: any;
  menus: Menu[];
}

const initMenuListForUsersComponentState: MenuListForUsersComponentState = {
  restaurant: null,
  menus: []
};

@Component({
  selector: 'app-menu-list-for-users',
  templateUrl: './menu-list-for-users.component.html',
  styleUrl: './menu-list-for-users.component.scss',
  providers:[RxState]
})
export class MenuListForUsersComponent implements OnInit{

  $restaurant = this.state.select('restaurant');
  restaurant: any = null;
  restaurantId: string | null = null;
  tableId: string | null = null;

  menus: Menu[] = [];
  menus$ = this.state.select('menus');

  categorizedMenus: { [category: string]: Menu[] } = {};

  constructor(
    private state: RxState<MenuListForUsersComponentState>,
    private restaurantFacade: RestaurantFacade,
    private menuFacade: MenuFacade,
    private route: ActivatedRoute
  ){
    this.state.set(initMenuListForUsersComponentState);
    this.state.connect('restaurant', this.restaurantFacade.selectedRestaurant$)
    this.state.connect('menus', this.menuFacade.menus$)
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.restaurantId = params.get('restaurantId');
      this.tableId = params.get('tableId');
      this.restaurantFacade.dispatchGetRestaurant(this.restaurantId);
      this.menuFacade.dispatchGetMenuByRestaurant(this.restaurantId);
    });

    this.$restaurant.subscribe((data)=>{
      this.restaurant = data;
    })

    this.menus$.subscribe((data)=>{
      this.menus = data;
      this.categorizeMenus()
    })
  }

  getImageUrl(imagePath: string): string {
    return `${API_BASE_URL}/uploads/${imagePath}`;
  }

  order(item: any): void {
    // Handle the order logic
    console.log(`Ordered: ${item.name}`);
  }

  categorizeMenus(): void {
    this.categorizedMenus = this.menus.reduce((acc, item) => {
      const category = item.category?.name || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as { [category: string]: Menu[] });
  }
}
