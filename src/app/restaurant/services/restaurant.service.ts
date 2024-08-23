import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RESTAURANTS_URL, USERS_URL } from 'src/app/core/constants/api-endpoints';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

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

  getRestaurant(id: string): Observable<any> {
    return this.http.get<any>(`${RESTAURANTS_URL}/${id}`);
  }
}
