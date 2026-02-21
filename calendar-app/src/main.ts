import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Use withInterceptors
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app/core/app.routes';
import { authInterceptor } from './app/features/auth/auth.interceptor'; // Import the interceptor function
import { MatNativeDateModule } from '@angular/material/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      // Use withInterceptors to provide function-based interceptors
      withInterceptors([authInterceptor])
    ),
    // Remove: { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })
    ),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatNativeDateModule)
  ]
});