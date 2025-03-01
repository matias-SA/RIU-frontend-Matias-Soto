import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private loadingRequestCount = 0;

  startLoading(): void {
    this.loadingRequestCount++;
    if (this.loadingRequestCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  stopLoading(): void {
    this.loadingRequestCount = Math.max(0, this.loadingRequestCount - 1);
    if (this.loadingRequestCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  setLoading(isLoading: boolean): void {
    if (isLoading) {
      this.startLoading();
    } else {
      this.stopLoading();
    }
  }
}
