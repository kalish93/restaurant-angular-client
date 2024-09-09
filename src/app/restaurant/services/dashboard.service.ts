import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from 'src/app/core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getNumberOfAdmins(){
    return this.http.get<any>(`${API_BASE_URL}/number-of-admins`);
  }
  getNumberOfRestaurants(){
    return this.http.get<any>(`${API_BASE_URL}/number-of-restaurants`);
  }
  getNumberOfRestaurantStaff(){
    return this.http.get<any>(`${API_BASE_URL}/number-of-restaurant-staff`);
  }
}
