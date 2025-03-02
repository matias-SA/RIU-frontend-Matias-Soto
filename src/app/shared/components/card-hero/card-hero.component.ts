import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Hero } from "../../../core/interfaces/hero.interface";

@Component({
  selector: "app-card-hero",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: "./card-hero.component.html",
  styleUrls: ["./card-hero.component.scss"],
})
export class CardHeroComponent {
  @Input() hero!: Hero;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() view = new EventEmitter<number>();
  onEdit(): void {
    this.edit.emit(this.hero.id);
  }
  onDelete(): void {
    this.delete.emit(this.hero.id);
  }
  onView(): void {
    this.view.emit(this.hero.id);
  }
}
