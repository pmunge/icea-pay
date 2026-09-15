import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { environment } from '../../../environments/env';
import { TableLoadingService } from '../services/table-loading';

/** Shows table loading feedback while API reads are in flight. */
export const tableLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const tableLoading = inject(TableLoadingService);
  tableLoading.begin();

  return next(req).pipe(finalize(() => tableLoading.end()));
};
