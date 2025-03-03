import { Injectable, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConfirmationService {
  private dialog = inject(MatDialog);

  confirm(message: string): Observable<boolean> {
    const result = window.confirm(message);
    return of(result);
  }
}
