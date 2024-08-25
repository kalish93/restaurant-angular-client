import { Category } from "./category.model";

export interface Menu {
  id : string,
  name : string,
  price : number,
  ingredients: string,
  category : Category,
}

