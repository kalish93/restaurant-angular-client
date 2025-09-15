import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasRoleDirective } from './has-role.directive';
import { HasSubscriptionDirective } from './has-subscription.directive';
import { ExcludeSubscriptionDirective } from './exclude-subscription.directive';

@NgModule({
  declarations: [HasRoleDirective, HasSubscriptionDirective, ExcludeSubscriptionDirective],
  imports: [CommonModule],
  exports: [HasRoleDirective, HasSubscriptionDirective, ExcludeSubscriptionDirective]
})
export class SharedDirectivesModule {}
