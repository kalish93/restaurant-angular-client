import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CATEGORY_URL } from 'src/app/core/constants/api-endpoints';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategoriesByRestaurant(restaurantId: string){
    return this.http.get<any>(`${CATEGORY_URL}/${restaurantId}`);
  }

  createCategory(data: { name: string; restaurantId: string }){
    return this.http.post<any>(CATEGORY_URL, data);
  }

  updateCategory(id: string, data: { name: string; restaurantId: string }){
    return this.http.put<any>(`${CATEGORY_URL}/${id}`, data);
  }

  deleteCategory(id: string){
    return this.http.delete<any>(`${CATEGORY_URL}/${id}`);
  }
}
