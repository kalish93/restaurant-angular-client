import { createPropertySelectors } from '@ngxs/store';
import {
  ProgressStatusState,
  ProgressStatusStateModel,
} from './progress-status.state';

export class ProgressStatusSelector {
  static slices =
    createPropertySelectors<ProgressStatusStateModel>(ProgressStatusState);
}
