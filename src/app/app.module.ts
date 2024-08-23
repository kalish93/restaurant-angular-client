import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { CoreModule } from './core/core.module';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { JwtInterceptor } from './auth/services/jwt.interceptor';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ProgressStatusState } from './core/store/progress-status.state';
import { ProgressStatusComponent } from './shared/shared-components/progress-status/progress-status.component';
import { NotificationState } from './core/store/notification.state';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([ProgressStatusState, NotificationState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot(),
    LoggerModule.forRoot({
      // serverLoggingUrl: '/api/v1/logs',
      level: NgxLoggerLevel.DEBUG,
      // serverLogLevel: NgxLoggerLevel.ERROR,
    }),

    CoreModule,
    AppRoutingModule,
    AuthModule,
    UsersModule,
    SharedModule,
    ProgressStatusComponent,
  ],
})
export class AppModule {}
