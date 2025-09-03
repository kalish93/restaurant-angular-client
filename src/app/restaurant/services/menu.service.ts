import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MENU_URL, ORDER_URL } from 'src/app/core/constants/api-endpoints';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';
import { Menu, Order } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {



  constructor(private http: HttpClient) {}

  createMenu(data: FormData): Observable<Menu> {

    return this.http.post<any>(`${MENU_URL}`, data);
  }

  updateMenu(menuId: string, data: FormData): Observable<Menu> {

    return this.http.put<any>(`${MENU_URL}/${menuId}`, data);
  }

  updateMenuAvailability(menuId: string, status: string): Observable<Menu> {
    return this.http.patch<any>(`${MENU_URL}/${menuId}/status`, { status:status});
  }

  deleteMenu(id: string): Observable<Menu> {
    return this.http.delete<any>(`${MENU_URL}/${id}`);
  }

  getMenus() {
    return this.http.get<any>( MENU_URL);
  }

  getMenuByRestaurant(id: string): Observable<Menu[]> {
    return this.http.get<any>(`${MENU_URL}/${id}`);
  }
}
