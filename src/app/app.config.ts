import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { OVERLAY_DEFAULT_CONFIG } from '@angular/cdk/overlay';

import { authInterceptorInterceptor } from './core/interceptors/auth-interceptor-interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptors([authInterceptorInterceptor])),
    // CDK overlays (mat-dialog, menus, etc.) default to the browser's native
    // popover "top layer", which no z-index can render above — that hid the
    // SweetAlert2 confirmation behind open Material dialogs. Opt back into
    // classic z-index-stacked overlays so third-party overlays like
    // SweetAlert2 can layer above them again.
    { provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } }

  ]
};
