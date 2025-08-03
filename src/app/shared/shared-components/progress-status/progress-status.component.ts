import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RxState } from '@rx-angular/state';
import { ProgressStatusFacade } from 'src/app/core/facades/progress-status.facade';
import { Observable } from 'rxjs';

interface ProgressStatusComponentState {
  inprogress: boolean;
}

const initProgressStatusComponentState: Partial<ProgressStatusComponentState> =
  {
    inprogress: false,
  };

@Component({
    selector: 'app-progress-status',
    imports: [CommonModule, MatProgressBarModule],
    templateUrl: './progress-status.component.html',
    styleUrls: ['./progress-status.component.scss'],
    providers: [RxState]
})
export class ProgressStatusComponent {
  inprogress$: Observable<boolean> = this.state.select('inprogress');

  constructor(
    private state: RxState<ProgressStatusComponentState>,
    private progressStatusFacade: ProgressStatusFacade
  ) {
    this.state.set(initProgressStatusComponentState);
    this.state.connect('inprogress', this.progressStatusFacade.inprogress$);
  }
}
