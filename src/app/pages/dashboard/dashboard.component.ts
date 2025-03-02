import { Component, inject, OnInit, signal } from "@angular/core";
import {
  HeroesService,
  PaginatedHeroes,
} from "../../core/services/heroes.service";
import { Hero } from "../../core/interfaces/hero.interface";
import { CardHeroComponent } from "../../shared/components/card-hero/card-hero.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TextInputComponent } from "@/app/shared/components/text-input/text-input.component";
import { take } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { Router } from "@angular/router";
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CardHeroComponent,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    TextInputComponent,
    PaginatorComponent,
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export default class DashboardComponent implements OnInit {
  heroesService = inject(HeroesService);

  form!: FormGroup;
  public heroes = signal<Hero[]>([]);
  public totalHeroes = signal<number>(0);
  public pageSize = signal<number>(5);
  public currentPage = signal<number>(0);

  private currentSearchTerm = signal<string>("");

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.loadHeroes(1);
    this.form = this.formBuilder.group({
      name: "",
    });
    this.setupSearch();
  }

  setupSearch(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        tap((value) => {
          const searchTerm = value.name.trim();
          this.currentSearchTerm.set(searchTerm);

          this.currentPage.set(0);

          if (searchTerm.length === 0) {
            this.loadHeroes(1);
          } else if (searchTerm.length >= 2) {
            this.searchHeroes(searchTerm, 1);
          }
        })
      )
      .subscribe();
  }

  loadHeroes(page: number): void {
    this.heroesService
      .getHeroes(page, this.pageSize())
      .pipe(take(1))
      .subscribe((response: PaginatedHeroes) => {
        this.heroes.set(response.heroes);
        this.totalHeroes.set(response.total);
        this.currentPage.set(response.currentPage - 1);
      });
  }

  searchHeroes(searchTerm: string, page: number): void {
    this.heroesService
      .searchHeroes(searchTerm, page, this.pageSize())
      .pipe(take(1))
      .subscribe((response: PaginatedHeroes) => {
        this.heroes.set(response.heroes);
        this.totalHeroes.set(response.total);
        this.currentPage.set(response.currentPage - 1);
      });
  }

  onPageChange({ pageIndex, pageSize }: PageEvent): void {
    this.pageSize.set(pageSize);
    if (this.currentSearchTerm().length === 0) {
      this.loadHeroes(pageIndex + 1);
    } else {
      this.searchHeroes(this.currentSearchTerm(), pageIndex + 1);
    }
  }

  onView(id: number): void {
    this.router.navigate(["/hero", id]);
  }

  onEdit(id: number): void {
    console.log(id);
  }

  onDelete(id: number): void {
    if (confirm("¿Estás seguro de que deseas eliminar este superhéroe?")) {
      this.heroesService.deleteHero(id).subscribe({
        next: () => {
          this.loadHeroes(this.currentPage() + 1);
        },
        error: (err) => console.error("Error al eliminar el héroe", err),
      });
    }
  }

  onAdd(): void {
    this.router.navigate(["/add-hero"]);
  }
}
