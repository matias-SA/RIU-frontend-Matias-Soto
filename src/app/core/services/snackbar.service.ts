import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class SnackbarService {
  private duration = 3000;
  private snackBar = inject(MatSnackBar);

  showSuccess(message: string): void {
    this.snackBar.open(message, "Cerrar", {
      duration: this.duration,
      panelClass: ["success-snackbar"],
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, "Cerrar", {
      duration: this.duration,
      panelClass: ["error-snackbar"],
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }

  showInfo(message: string): void {
    this.snackBar.open(message, "Cerrar", {
      duration: this.duration,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }
}
