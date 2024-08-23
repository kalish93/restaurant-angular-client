import { Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GetCurrentDateTime } from '../store/datetime.actions';
import { DateTimeSelector } from '../store/datetime.selector';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateTimeFacade {
  constructor(private store: Store) {}

  @Select(DateTimeSelector.datetime)
  datetime$!: Observable<string>;

  dispatchGetCurrentDateTime() {
    this.store.dispatch(new GetCurrentDateTime());
  }
}
