import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RESTAURANTS_URL, STOCKS_URL } from 'src/app/core/constants/api-endpoints';
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
    const entries = (data as any).entries();

    for (let [key, value] of entries) {
      console.log(`${key}:`, value);
}

    return this.http.post<any>(`${STOCKS_URL}`, data);
  }

  getStocks(
    pageNumber: number,
    pageSize: number
  ): Observable<PaginatedList<any>> {
    return this.http.get<PaginatedList<any>>(
      `${STOCKS_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}
