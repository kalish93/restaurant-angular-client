import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/menu.model';
import { ORDER_URL } from 'src/app/core/constants/api-endpoints';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient) {}

   placeOrder(data: string): Observable<any> {
    return this.http.post<Order[]>(ORDER_URL, data);
  }

   getActiveTableOrder(tableId: string): Observable<any> {
    return this.http.get<any>(`${ORDER_URL}/active/${tableId}`);
  }

   getActiveOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${ORDER_URL}/active`);
  }

   getOrderHistory(pageNumber: number,
    pageSize: number): Observable<any[]> {
    return this.http.get<any[]>(`${ORDER_URL}/history?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  }

   upateOrderStatus(data: any): Observable<any> {
    return this.http.put<any>(`${ORDER_URL}/status`, data);
  }

   removeOrderItem(itemId: any): Observable<any> {
    return this.http.delete<any>(`${ORDER_URL}/items/${itemId}`);
  }
   addOrderItem(data: any): Observable<any> {
    return this.http.post<any>(`${ORDER_URL}/items`, data);
  }
   updateOrderItem(data: any): Observable<any> {
    return this.http.put<any>(`${ORDER_URL}/items`, data);
  }

   requestPayment(tableId: any): Observable<any> {
    return this.http.post<any>(`${ORDER_URL}/${tableId}/request-payment`, {});
  }

   markAsPaid(orderIds: any): Observable<any> {
    return this.http.post<any>(`${ORDER_URL}/bill`, orderIds);
  }
}
