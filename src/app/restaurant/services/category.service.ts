import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CATEGORY_URL } from 'src/app/core/constants/api-endpoints';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  // };

  constructor(private http: HttpClient) { }

  getCategories(){
    console.log("inside service", CATEGORY_URL);
    console.log(this.http)
    return this.http.get<any>(CATEGORY_URL);
  }
}
