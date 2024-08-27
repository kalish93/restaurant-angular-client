import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MENU_URL } from 'src/app/core/constants/api-endpoints';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  
  constructor(private http: HttpClient) {}

  createMenu(data: FormData): Observable<Menu> {
    const entries = (data as any).entries();

    for (let [key, value] of entries) {
      console.log(`${key}:`, value);
}

    return this.http.post<any>(`${MENU_URL}`, data);
  }

  updateMenu(menuId: string, data: FormData): Observable<Menu> {
    const entries = (data as any).entries();

    for (let [key, value] of entries) {
      console.log(`${key}:`, value);
}

    return this.http.put<any>(`${MENU_URL}/${menuId}`, data);
  }

  deleteMenu(id: string): Observable<Menu> {
    return this.http.delete<any>(`${MENU_URL}/${id}`);
  }

  getMenus() {
    return this.http.get<any>( MENU_URL);
  }
}
