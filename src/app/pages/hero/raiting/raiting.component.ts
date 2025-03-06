import { Component, OnInit, inject, signal, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
@Component({
  selector: "app-raiting",
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="hero-rating">
      <span class="rating-label">Calificación:</span>
      <div class="stars">
        @for(star of [].constructor(rating() || 0); track $index) {
        <mat-icon color="accent">star</mat-icon>
        } @for(emptyStar of [].constructor(10 - (rating() || 0)); track $index){
        <mat-icon color="accent">star_border</mat-icon>
        }
      </div>
      <span class="rating-value">{{ rating() || 0 }}/10</span>
    </div>
  `,
  styles: `
    .hero-rating {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;

          .rating-label {
            font-weight: 500;
            color: #555;
          }

          .stars {
            display: flex;

            mat-icon {
              height: 20px;
              width: 20px;
              font-size: 20px;
            }
          }

          .rating-value {
            font-weight: bold;
            margin-left: 0.5rem;
          }
        }
  `,
})
export default class RaitingComponent implements OnInit {
  rating = input<number | undefined>(0);
  ngOnInit(): void {}
}
