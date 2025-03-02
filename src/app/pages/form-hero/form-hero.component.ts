import { Component, OnInit, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { TextInputComponent } from "@shared/components/text-input/text-input.component";
import { MatButtonModule } from "@angular/material/button";
import { HeroesService } from "@/app/core/services/heroes.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-form-hero",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextInputComponent,
    MatButtonModule,
  ],
  templateUrl: "./form-hero.component.html",
  styleUrl: "./form-hero.component.scss",
})
export default class FormHeroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private heroesService = inject(HeroesService);
  private router = inject(Router);

  formHero!: FormGroup;

  ngOnInit(): void {
    this.formHero = this.fb.group({
      name: ["Matias", [Validators.required]],
      image: [
        "https://github.com/akabab/superhero-api/blob/master/api/images/md/622-spider-man.jpg",
        [Validators.required],
      ],
      description: ["Aprendiendo Angular", [Validators.required]],
      team: ["Marvel", [Validators.required]],
      powers: ["", [Validators.required]],
      firstAppearance: ["2024", [Validators.required]],
      realName: ["Matias", [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.formHero.valid) {
      this.heroesService.createHero(this.formHero.value).subscribe({
        next: () => {
          this.router.navigate(["/dashboard"]);
        },
        error: (err) => console.error("Error al crear el héroe", err),
      });
    }
  }
}
