import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { DateTimeState } from './store/detetime.state';
import { NotificationCardComponent } from './components/notification-card/notification-card.component';
import { SharedModule } from '../shared/shared.module';
import { NotificationMenuComponent } from './components/notification-menu/notification-menu.component';
import { NotificationButtonComponent } from './components/notification-button/notification-button.component';

@NgModule({
  declarations: [
    NotificationCardComponent,
    NotificationMenuComponent,
    NotificationButtonComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    SharedModule,
    HttpClientModule,
    NgxsModule.forFeature([DateTimeState]),
  ],
  exports: [
    HttpClientModule,
    NotificationMenuComponent,
    NotificationButtonComponent,
  ],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
