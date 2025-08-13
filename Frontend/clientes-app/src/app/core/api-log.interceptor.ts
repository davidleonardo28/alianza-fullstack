// src/app/core/api-log.interceptor.ts
import {
  HttpEvent,
  HttpEventType,
  HttpInterceptorFn,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

export const apiLogInterceptor: HttpInterceptorFn = (req, next) => {
  const start = Date.now();

  return next(req).pipe(
    tap({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          const ms = Date.now() - start;
          console.log(
            '[API]',
            req.method,
            req.urlWithParams,
            'status',
            event.status,
            `${ms}ms`
          );
        }
      },
      error: (err) => {
        console.error('[API ERR]', req.method, req.urlWithParams, err);
      },
    })
  );
};
