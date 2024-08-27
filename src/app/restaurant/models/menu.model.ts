import { Category } from "./category.model";

export interface Menu {
  id : string,
  name : string,
  price : number,
  ingredient: string,
  category : Category,
  image: string
}

