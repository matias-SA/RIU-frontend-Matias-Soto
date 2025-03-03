import { Component, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Hero } from "@core/interfaces/hero.interface";

@Component({
  selector: "app-hero-preview",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./hero-preview.component.html",
  styleUrl: "./hero-preview.component.scss",
})
export default class HeroPreviewComponent {
  hero = input<Hero>();

  isMarvelTeam(): boolean {
    const team = this.hero()?.team?.toLowerCase() || "";
    return team === "marvel";
  }

  isDCTeam(): boolean {
    const team = this.hero()?.team?.toLowerCase() || "";
    return team === "dc";
  }
}
