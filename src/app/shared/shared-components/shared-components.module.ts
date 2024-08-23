import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmWithDateDialogComponent } from './confirm-with-date-dialog/confirm-with-date-dialog.component';

export const SHARED_COMPONENTS: Array<Type<any>> = [];

@NgModule({
  declarations: [...SHARED_COMPONENTS],
  imports: [CommonModule],
  exports: [...SHARED_COMPONENTS],
})
export class SharedComponentsModule {}
