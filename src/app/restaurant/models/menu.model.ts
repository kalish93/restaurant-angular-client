import { Category } from "./category.model";

export interface Menu {
  id : string,
  name : string,
  price : number,
  ingredients: string,
  category : Category,
  image: string,
  destination: any;
  currency: string;
}

export interface Cart {
  menuItem: Menu,
  quantity: number,
  specialInstructions?: string;
  showInstructions: boolean;
}

export interface Order{
  restaurantId: string;
  tableId: string;
  items: Cart[]
}
