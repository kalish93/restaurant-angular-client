import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ROLES_URL } from 'src/app/core/constants/api-endpoints';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${ROLES_URL}`);
  }
}
