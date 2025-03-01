import { Component, signal } from "@angular/core";
import { HeroesService } from "../../core/services/heroes.service";
import { Hero } from "../../core/interfaces/hero.interface";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export default class DashboardComponent {
  public heroes = signal<Hero[]>([]);

  constructor(private heroesService: HeroesService) {
    this.heroesService.getHeroes().subscribe((heroes) => {
      this.heroes.set(heroes);
    });
  }
}
