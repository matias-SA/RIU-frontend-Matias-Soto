import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { of, throwError } from "rxjs";

import DashboardComponent from "./dashboard.component";
import { HeroesService } from "../../core/services/heroes.service";
import { CardHeroComponent } from "../../shared/components/card-hero/card-hero.component";
import { TextInputComponent } from "../../shared/components/text-input/text-input.component";
import { PaginatorComponent } from "../../shared/components/paginator/paginator.component";
import { Hero } from "../../core/interfaces/hero.interface";
import { ConfirmationService } from "../../core/services/confirmation.service";
import { SnackbarService } from "../../core/services/snackbar.service";

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let heroesService: jasmine.SpyObj<HeroesService>;
  let confirmationService: jasmine.SpyObj<ConfirmationService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;

  const mockHeroes: Hero[] = [
    {
      id: 1,
      name: "Spiderman",
      image: "spiderman.jpg",
      team: "Marvel",
      powers: ["telaraña", "agilidad", "fuerza"],
      rating: 5,
      realName: "Peter Parker",
      firstAppearance: 1962,
      description: "El amigable vecino Spiderman",
    },
    {
      id: 2,
      name: "Batman",
      image: "batman.jpg",
      team: "DC",
      powers: ["inteligencia", "artes marciales", "tecnología"],
      rating: 4,
      realName: "Bruce Wayne",
      firstAppearance: 1939,
      description: "El caballero de la noche",
    },
  ];

  const mockPaginatedResponse = {
    heroes: mockHeroes,
    total: 2,
    currentPage: 1,
    totalPages: 1,
  };

  beforeEach(async () => {
    const heroesServiceSpy = jasmine.createSpyObj("HeroesService", [
      "getHeroes",
      "searchHeroes",
      "deleteHero",
    ]);

    const confirmationServiceSpy = jasmine.createSpyObj("ConfirmationService", [
      "confirm",
    ]);
    const snackbarServiceSpy = jasmine.createSpyObj("SnackbarService", [
      "showSuccess",
      "showError",
    ]);

    heroesServiceSpy.getHeroes.and.returnValue(of(mockPaginatedResponse));
    heroesServiceSpy.searchHeroes.and.returnValue(of(mockPaginatedResponse));
    heroesServiceSpy.deleteHero.and.returnValue(of(null));
    confirmationServiceSpy.confirm.and.returnValue(of(true)); // Por defecto, confirmar

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        CardHeroComponent,
        TextInputComponent,
        PaginatorComponent,
      ],
      providers: [
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    heroesService = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
    confirmationService = TestBed.inject(
      ConfirmationService
    ) as jasmine.SpyObj<ConfirmationService>;
    snackbarService = TestBed.inject(
      SnackbarService
    ) as jasmine.SpyObj<SnackbarService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("debería crear el componente", () => {
    expect(component).toBeTruthy();
  });

  it("debería cargar héroes al inicializar", () => {
    expect(heroesService.getHeroes).toHaveBeenCalledWith(1, 5);
    expect(component.heroes()).toEqual(mockHeroes);
    expect(component.totalHeroes()).toBe(2);
  });

  it("debería mostrar los héroes en la cuadrícula", () => {
    const heroCards = fixture.debugElement.queryAll(
      By.directive(CardHeroComponent)
    );
    expect(heroCards.length).toBe(2);

    const firstHeroCard = heroCards[0].componentInstance;
    expect(firstHeroCard.hero).toEqual(mockHeroes[0]);
  });

  it("debería buscar héroes cuando se ingresa texto en el campo de búsqueda", fakeAsync(() => {
    const filteredResponse = {
      heroes: [mockHeroes[0]],
      total: 1,
      currentPage: 1,
      totalPages: 1,
    };
    heroesService.searchHeroes.and.returnValue(of(filteredResponse));

    component.form.get("name")?.setValue("Spider");
    tick(300);

    expect(heroesService.searchHeroes).toHaveBeenCalledWith("Spider", 1, 5);
    expect(component.heroes()).toEqual([mockHeroes[0]]);
    expect(component.totalHeroes()).toBe(1);
  }));

  it("debería navegar a la página de detalles al hacer clic en ver", () => {
    const routerSpy = spyOn(component.router, "navigate");
    component.onView(1);
    expect(routerSpy).toHaveBeenCalledWith(["/hero", 1]);
  });

  it("debería navegar a la página de edición al hacer clic en editar", () => {
    const routerSpy = spyOn(component.router, "navigate");
    component.onEdit(1);
    expect(routerSpy).toHaveBeenCalledWith(["/edit-hero", 1]);
  });

  it("debería eliminar un héroe cuando se confirma la eliminación", fakeAsync(() => {
    confirmationService.confirm.and.returnValue(of(true));

    component.onDelete(1);
    tick();

    expect(confirmationService.confirm).toHaveBeenCalledWith(
      "¿Eliminar héroe?"
    );

    expect(heroesService.deleteHero).toHaveBeenCalledWith(1);

    expect(snackbarService.showSuccess).toHaveBeenCalledWith(
      "Héroe eliminado con éxito"
    );

    expect(heroesService.getHeroes).toHaveBeenCalledTimes(2);
  }));

  it("no debería eliminar un héroe cuando se cancela la confirmación", fakeAsync(() => {
    confirmationService.confirm.and.returnValue(of(false));

    component.onDelete(1);
    tick();

    expect(confirmationService.confirm).toHaveBeenCalled();

    expect(heroesService.deleteHero).not.toHaveBeenCalled();

    expect(snackbarService.showSuccess).not.toHaveBeenCalled();
  }));

  it("debería mostrar un mensaje de error si falla la eliminación del héroe", fakeAsync(() => {
    confirmationService.confirm.and.returnValue(of(true));

    const errorResponse = new Error("Error al eliminar el héroe");
    heroesService.deleteHero.and.returnValue(throwError(() => errorResponse));

    component.onDelete(1);
    tick();

    expect(snackbarService.showError).toHaveBeenCalledWith(
      "Error al eliminar el héroe"
    );
  }));

  it("debería navegar a la página de añadir héroe al hacer clic en añadir", () => {
    const routerSpy = spyOn(component.router, "navigate");
    component.onAdd();
    expect(routerSpy).toHaveBeenCalledWith(["/add-hero"]);
  });

  it("debería cambiar de página cuando se activa el evento de cambio de página", () => {
    const pageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    component.onPageChange(pageEvent);

    expect(heroesService.getHeroes).toHaveBeenCalledWith(2, 5);
  });

  it("debería mostrar mensaje cuando no hay resultados", () => {
    const emptyResponse = {
      heroes: [],
      total: 0,
      currentPage: 1,
      totalPages: 0,
    };
    heroesService.getHeroes.and.returnValue(of(emptyResponse));

    component.loadHeroes(1);
    fixture.detectChanges();

    const noResultsElement = fixture.debugElement.query(By.css(".no-results"));
    expect(noResultsElement).toBeTruthy();
    expect(noResultsElement.nativeElement.textContent).toContain(
      "No se encontraron superhéroes"
    );
  });
});
