import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { HeroesService } from "../../core/services/heroes.service";
import { Hero } from "../../core/interfaces/hero.interface";
import { switchMap } from "rxjs/operators";
import { EMPTY } from "rxjs";
import RaitingComponent from "./raiting/raiting.component";

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    RaitingComponent,
  ],
  templateUrl: "./hero.component.html",
  styleUrl: "./hero.component.scss",
})
export default class HeroComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private heroesService = inject(HeroesService);

  hero = signal<Hero | undefined>(undefined);

  ngOnInit(): void {
    this.loadHero();
  }
  private loadHero(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get("id"));
          if (isNaN(id)) {
            this.router.navigate(["/dashboard"]);
            return EMPTY;
          }
          return this.heroesService.getHeroById(id);
        })
      )
      .subscribe((hero) => {
        if (!hero) {
          this.router.navigate(["/dashboard"]);
          return;
        }
        this.hero.set(hero);
      });
  }
}
