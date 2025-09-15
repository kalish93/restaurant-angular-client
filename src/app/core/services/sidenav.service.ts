import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  private toggleSidenavSubject = new Subject<void>();
  public toggleSidenav$: Observable<void> =
    this.toggleSidenavSubject.asObservable();

  constructor() {}

  toggleSidenav(): void {
    this.toggleSidenavSubject.next();
  }
}
