import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, of, retry, throwError, timer } from 'rxjs';
import { OperationStatusService } from '../services/operation-status/operation-status.service';
import { NGXLogger } from 'ngx-logger';
import { errorStyle } from '../services/operation-status/status-style-names';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import { ProgressStatusFacade } from '../facades/progress-status.facade';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Logout } from 'src/app/auth/store/auth.actions';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private operationStatusService: OperationStatusService,
    private logger: NGXLogger,
    private authFacade: AuthFacade,
    private progressStatusFacade: ProgressStatusFacade,
    private router: Router,
    private store: Store
  ) {}

  shouldRetry(error: any, retryCount: number) {
    if (error.status >= 500) {
      return timer(retryCount * 500);
    }
    throw error;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      retry({
        count: 2,
        delay: this.shouldRetry,
      }),
      catchError((error) => {
        this.logger.error(error);

        this.progressStatusFacade.dispatchSetProgessOff();

        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            this.operationStatusService.displayStatus(
              `Something went wrong, ${error.error.title}`,
              errorStyle
            );
          } else if (error.status == 401 && error.error.error == 'Unauthorized - Missing token') {
            return of();
          } else if (error.status == 401 && error.error.error == 'jwt expired') {
            this.router.navigate(['/login']);
            this.store.dispatch(new Logout());

          } else if (error.status == 401 || error.status == 403) {
            // dispatch logout action
            this.operationStatusService.displayStatus(
              error.error.error,
              errorStyle,
              0
            );
          } else if (error.status == 400) {
            // handling "One or more validation errors" error,
            if (error.error.errors) {
              for (var key in error.error.errors) {
                this.operationStatusService.displayStatus(
                  error.error.errors[key][0],
                  errorStyle,
                  0
                );
                break;
              }
            } else {
              this.operationStatusService.displayStatus(
                error.error.error,
                errorStyle,
                0
              );
            }
          } else {
            this.operationStatusService.displayStatus(
              error.error.error,
              errorStyle,
              0
            );
          }
          return of();
        }
        return throwError(() => {
          this.operationStatusService.displayStatus(
            error.error.error,
            errorStyle,
            0
          );
        });
      })
    );
  }
}
