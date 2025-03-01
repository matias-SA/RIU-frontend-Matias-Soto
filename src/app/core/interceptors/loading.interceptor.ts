import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { delay, finalize } from "rxjs/operators";
import { LoadingService } from "../services/loading.service";

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.startLoading();

  return next(req).pipe(
    delay(1000),
    finalize(() => {
      loadingService.stopLoading();
    })
  );
};
