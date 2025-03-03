import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { HeroesService } from "../../core/services/heroes.service";
import { SnackbarService } from "../../core/services/snackbar.service";
import { TextInputComponent } from "../../shared/components/text-input/text-input.component";
import HeroPreviewComponent from "./hero-preview/hero-preview.component";

@Component({
  selector: "app-form-hero",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TextInputComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    HeroPreviewComponent,
  ],
  templateUrl: "./form-hero.component.html",
  styleUrl: "./form-hero.component.scss",
})
export default class FormHeroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private heroesService = inject(HeroesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackbarService = inject(SnackbarService);

  formHero!: FormGroup;
  isEditMode = signal<boolean>(false);
  heroId = signal<number | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.setFormValues();
  }

  private setFormValues(): void {
    this.heroId.set(Number(this.route.snapshot.paramMap.get("id")));
    if (this.heroId()) {
      this.heroesService
        .getHeroById(Number(this.heroId()))
        .subscribe((hero) => {
          if (hero) {
            this.formHero.patchValue({
              ...hero,
              name: hero.name.toUpperCase(),
            });
            this.isEditMode.set(true);
          } else {
            this.snackbarService.showError("Superhéroe no encontrado");
            this.router.navigate(["/dashboard"]);
          }
        });
    }
  }

  private initForm(): void {
    this.formHero = this.fb.group({
      name: ["", [Validators.required]],
      image: [
        "",
        [
          Validators.required,
          Validators.pattern(/^https?:\/\/.*\.(jpg|jpeg|png)$/),
        ],
      ],
      description: ["", [Validators.required]],
      team: ["", [Validators.required]],
      powers: ["", [Validators.required]],
      firstAppearance: ["", [Validators.required]],
      realName: ["", [Validators.required]],
    });
  }

  private processPowers(powers: string | string[]): string[] {
    if (!powers) return [];
    if (typeof powers === "string") {
      return powers
        .split(",")
        .map((power) => power.trim())
        .filter((power) => power.length > 0);
    }
    return powers;
  }

  onSubmit(): void {
    if (this.formHero.valid) {
      this.isEditMode()
        ? this.onUpdate(this.formHero.value)
        : this.onCreate(this.formHero.value);
    }
  }

  onUpdate(formValues: any): void {
    const heroData = {
      ...formValues,
      powers: this.processPowers(formValues.powers),
      firstAppearance: Number(formValues.firstAppearance),
    };

    this.heroesService.updateHero(Number(this.heroId()), heroData).subscribe({
      next: (hero) => {
        this.snackbarService.showSuccess(
          `¡Superhéroe ${hero.name} actualizado con éxito!`
        );
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        console.error("Error al actualizar el superhéroe", err);
        this.snackbarService.showError("Error al actualizar el superhéroe");
      },
    });
  }

  onCreate(formValues: any): void {
    const heroData = {
      ...formValues,
      powers: this.processPowers(formValues.powers),
      firstAppearance: Number(formValues.firstAppearance),
    };

    this.heroesService.createHero(heroData).subscribe({
      next: (hero) => {
        this.snackbarService.showSuccess(
          `¡Superhéroe ${hero.name} creado con éxito!`
        );
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        this.snackbarService.showError("Error al crear el superhéroe");
      },
    });
  }
}
