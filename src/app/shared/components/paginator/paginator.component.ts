import { Component, input, output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
@Component({
  selector: "app-paginator",
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="totalHeroes()"
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions()"
      [pageIndex]="currentPage()"
      (page)="onPageChange($event)"
      aria-label="Seleccionar página"
      class="paginator"></mat-paginator>
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
export class PaginatorComponent {
  constructor() {}
  public pageChange = output<PageEvent>();
  public totalHeroes = input<number>(0);
  public pageSize = input<number>(5);
  public currentPage = input<number>(0);
  public pageSizeOptions = input<number[]>([5, 10, 15, 20]);

  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
