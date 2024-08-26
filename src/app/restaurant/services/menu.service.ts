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


  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  // };

  constructor(private http: HttpClient) {}

  createMenu(data: FormData): Observable<Menu> {
    const entries = (data as any).entries();

    for (let [key, value] of entries) {
      console.log(`${key}:`, value);
}

    return this.http.post<any>(`${MENU_URL}`, data);
  }

  getMenus(
    pageNumber: any,
    pageSize: any
  ): Observable<PaginatedList<any>> {
    return this.http.get<PaginatedList<any>>(
      `${MENU_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}
