import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasPermissionsDirective } from './has-permissions.directive';

@NgModule({
  declarations: [HasPermissionsDirective],
  imports: [CommonModule],
  exports: [HasPermissionsDirective]
})
export class SharedDirectivesModule {}
