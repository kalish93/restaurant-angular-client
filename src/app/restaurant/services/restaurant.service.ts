import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RESTAURANTS_URL, TABLES_URL, USERS_URL } from 'src/app/core/constants/api-endpoints';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {



  constructor(private http: HttpClient) {}
  getRestaurant(id: string): Observable<any> {
    return this.http.get<any>(`${RESTAURANTS_URL}/${id}`);
  }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  createRestaurant(restaurant: any): Observable<any> {
    return this.http.post<any>(`${RESTAURANTS_URL}`, restaurant, this.httpOptions);
  }

  getRestaurants(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedList<any>> {
    return this.http.get<PaginatedList<any>>(
      `${RESTAURANTS_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }


  addRestaurantStaff(staff: any): Observable<any> {
    return this.http.post<any>(`${RESTAURANTS_URL}/staff`, staff, this.httpOptions);
  }

  updateRestaurantStaff(staff: any, id:any): Observable<any> {
    return this.http.put<any>(`${USERS_URL}/${id}`, staff, this.httpOptions);
  }

  deleteRestaurantStaff(id:any): Observable<any> {
    return this.http.delete<any>(`${USERS_URL}/${id}`, this.httpOptions);
  }

  getTables(): Observable<any[]> {
    return this.http.get<any[]>(TABLES_URL, this.httpOptions);
  }

  createTable(table: any): Observable<any> {
    return this.http.post<any>(`${TABLES_URL}`, table, this.httpOptions);
  }

  downloadQRCode(tableId: string): Observable<any> {
    const options = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    const downloadUrl = `${TABLES_URL}/${tableId}/download-qr`;
    return this.http.get<any>(downloadUrl, options);
  }

  updateRestaurant(restaurant: any): Observable<any> {
    return this.http.put<any>(`${RESTAURANTS_URL}/${restaurant.id}`, restaurant, this.httpOptions);
  }

  deleteRestaurant(restaurantId: any): Observable<any> {
    return this.http.delete<any>(`${RESTAURANTS_URL}/${restaurantId}`, this.httpOptions);
  }

  updateTable(table: any): Observable<any> {
    return this.http.put<any>(`${TABLES_URL}/${table.id}`, table, this.httpOptions);
  }

  deleteTable(tableId: any): Observable<any> {
    return this.http.delete<any>(`${TABLES_URL}/${tableId}`, this.httpOptions);
  }

  getTable(tableId: any): Observable<any> {
    return this.http.get<any>(`${TABLES_URL}/${tableId}`);
  }
}
