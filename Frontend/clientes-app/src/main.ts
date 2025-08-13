import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app/app.routes';
import { apiLogInterceptor } from './app/core/api-log.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiLogInterceptor])),
    provideAnimationsAsync(),
  ],
}).catch((err) => console.error(err));
