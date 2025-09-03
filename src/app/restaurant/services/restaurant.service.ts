import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL, MENU_URL, RESTAURANTS_URL, TABLES_URL, USERS_URL } from 'src/app/core/constants/api-endpoints';
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
  createRestaurant(restaurant: FormData): Observable<any> {
    return this.http.post<any>(`${RESTAURANTS_URL}`, restaurant);
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

  updateRestaurant(restaurantId: string, data: FormData): Observable<any> {
    return this.http.put<any>(`${RESTAURANTS_URL}/${restaurantId}`, data);
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

  updateRestaurantStatus(data: any): Observable<any> {
    return this.http.put<any>(`${RESTAURANTS_URL}/${data.restaurantId}/status`, data, this.httpOptions);
  }

  updateRestaurantTaxRate(data: any): Observable<any> {
    return this.http.put<any>(`${RESTAURANTS_URL}/${data.restaurantId}/tax-rate`, data, this.httpOptions);
  }

  createCreditCard(data: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/credit-cards`, data, this.httpOptions);
  }

  deleteCreditCard(id: any): Observable<any> {
    return this.http.delete<any>(`${API_BASE_URL}/credit-cards/${id}`, this.httpOptions);
  }

  getCreditCards(restaurantId: any): Observable<any> {
    return this.http.get<any>(`${RESTAURANTS_URL}/${restaurantId}/credit-cards`, this.httpOptions);
  }

  createDiscounts(data: any): Observable<any> {
    return this.http.post<any>(`${API_BASE_URL}/discounts`, data, this.httpOptions);
  }

  deleteDiscount(id: any): Observable<any> {
    return this.http.delete<any>(`${API_BASE_URL}/discounts/${id}`, this.httpOptions);
  }

  getDiscounts(restaurantId: any): Observable<any> {
    return this.http.get<any>(`${RESTAURANTS_URL}/${restaurantId}/discounts`, this.httpOptions);
  }

  getZreportData(restaurantId: any): Observable<any> {
    return this.http.get<any>(`${RESTAURANTS_URL}/${restaurantId}/z-report`, this.httpOptions);
  }

  updateRestaurantActiveStatus(data: any): Observable<any> {
    return this.http.put<any>(`${RESTAURANTS_URL}/${data.restaurantId}/active`, data, this.httpOptions);
  }

  generateMenuQrCode(): Observable<any> {
    return this.http.post<any>(`${MENU_URL}/qr-code`, {}, this.httpOptions);
  }

  downloadMenuQrCode(): Observable<any> {
    const options = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    const downloadUrl = `${MENU_URL}/qr-code/download`;
    return this.http.get<any>(downloadUrl, options);
  }
}
