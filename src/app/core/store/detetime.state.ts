import { Injectable } from '@angular/core';
import { Action, State, StateContext, StateToken } from '@ngxs/store';
import { DateTimeService } from '../services/datetime/datetime.service';
import { GetCurrentDateTime } from './datetime.actions';
import { tap } from 'rxjs';

export interface DateTimeStateModel {
  dateTime: string;
}

const DATETIME_STATE_TOKEN = new StateToken<DateTimeStateModel>('datetime');

const defaults: DateTimeStateModel = {
  dateTime: '',
};

@State<DateTimeStateModel>({
  name: DATETIME_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class DateTimeState {
  constructor(private datetimeService: DateTimeService) {}

  @Action(GetCurrentDateTime)
  getCurrentDateTime(
    { patchState }: StateContext<DateTimeStateModel>,
    {}: GetCurrentDateTime
  ) {
    return this.datetimeService.getCurrentDateTime().pipe(
      tap((d) => {
        patchState({
          dateTime: d,
        });
      })
    );
  }
}
