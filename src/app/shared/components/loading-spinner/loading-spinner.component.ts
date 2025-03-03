import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingService } from "../../../core/services/loading.service";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: "app-loading-spinner",
  standalone: true,
  imports: [CommonModule, MatProgressSpinner],
  template: `
    @if(loadingService.loading$ | async) {
    <div class="loading-overlay">
      <div class="spinner-container">
        <mat-spinner></mat-spinner>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }

      .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .loading-text {
        margin-top: 10px;
        font-size: 16px;
        color: #333;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  loadingService = inject(LoadingService);
}
