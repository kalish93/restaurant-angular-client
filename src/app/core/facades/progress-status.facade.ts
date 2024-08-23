import { Observable } from 'rxjs';
import { ProgressStatusSelector } from '../store/progress-status.selector';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  SetProgressOff,
  SetProgressOn,
} from '../store/progress-status.actions';

@Injectable({
  providedIn: 'root',
})
export class ProgressStatusFacade {
  inprogress$: Observable<boolean> = this.store.select(
    ProgressStatusSelector.slices.inprogress
  );

  constructor(private store: Store) {}

  dispatchSetProgessOff() {
    this.store.dispatch(new SetProgressOff());
  }

  dispatchSetProgessOn() {
    this.store.dispatch(new SetProgressOn());
  }
}
