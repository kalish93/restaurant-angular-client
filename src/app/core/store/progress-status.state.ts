import { Injectable } from '@angular/core';
import { SetProgressOff, SetProgressOn } from './progress-status.actions';
import { Action, State, StateContext, StateToken } from '@ngxs/store';

export interface ProgressStatusStateModel {
  inprogress: boolean;
}

const PROGRESS_STATUS_STATE_TOKEN = new StateToken<ProgressStatusStateModel>(
  'progressStatusState'
);

const defaults = {
  inprogress: false,
};

@State<ProgressStatusStateModel>({
  name: PROGRESS_STATUS_STATE_TOKEN,
  defaults: defaults,
})
@Injectable()
export class ProgressStatusState {
  @Action(SetProgressOff)
  setProgressOff({ setState }: StateContext<ProgressStatusStateModel>) {
    setState({ inprogress: false });
  }

  @Action(SetProgressOn)
  setProgressOn({ setState }: StateContext<ProgressStatusStateModel>) {
    setState({ inprogress: true });
  }
}
