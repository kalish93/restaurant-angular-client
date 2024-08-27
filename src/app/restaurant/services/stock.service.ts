import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  STOCKS_URL } from 'src/app/core/constants/api-endpoints';
import { PaginatedList } from 'src/app/core/models/paginated-list.interface';

@Injectable({
  providedIn: 'root'
})
export class StockService {


  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  // };

  constructor(private http: HttpClient) {}

  createStock(data: FormData): Observable<any> {
    
    return this.http.post<any>(`${STOCKS_URL}`, data);
  }

  getStocks(
    pageNumber?: number,
    pageSize?: number
  ): Observable<PaginatedList<any>> {
    let url = STOCKS_URL;
    if(pageNumber && pageSize){
      url += `?pageNumber=${pageNumber}&pageSize=${pageSize}`
    }
    return this.http.get<PaginatedList<any>>(
      url
    );
  }

  updateStock(id: any, data: FormData): Observable<any> {

    return this.http.put<any>(`${STOCKS_URL}/${id}`, data);
  }

  deleteStock(stockId: any): Observable<any> {
    return this.http.delete<any>(`${STOCKS_URL}/${stockId}`);
  }
}
