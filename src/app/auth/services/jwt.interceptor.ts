import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AuthSelector } from '../store/auth.selector';

@Injectable({ providedIn: 'root' })
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const tokens = this.store.selectSnapshot(AuthSelector.tokens);
    if (tokens.accessToken) {
      return next.handle(
        request.clone({
          setHeaders: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        })
      );
    }

    return next.handle(request);
  }
}
