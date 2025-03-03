import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { RouterModule } from "@angular/router";

import FormHeroComponent from "./form-hero.component";
import { HeroesService } from "../../core/services/heroes.service";
import { SnackbarService } from "../../core/services/snackbar.service";
import { TextInputComponent } from "../../shared/components/text-input/text-input.component";
import HeroPreviewComponent from "./hero-preview/hero-preview.component";
import { Hero } from "../../core/interfaces/hero.interface";

describe("FormHeroComponent", () => {
  let component: FormHeroComponent;
  let fixture: ComponentFixture<FormHeroComponent>;
  let heroesService: jasmine.SpyObj<HeroesService>;
  let snackbarService: jasmine.SpyObj<SnackbarService>;
  let router: any;

  const mockHero: Hero = {
    id: 1,
    name: "Spider-Man",
    realName: "Peter Parker",
    team: "Marvel",
    image: "https://example.com/spiderman.jpg",
    powers: ["Web-shooting", "Wall-crawling"],
    description: "Your friendly neighborhood Spider-Man",
    firstAppearance: 1962,
    rating: 5,
  };

  beforeEach(async () => {
    const heroesServiceSpy = jasmine.createSpyObj("HeroesService", [
      "getHeroById",
      "createHero",
      "updateHero",
    ]);
    const snackbarServiceSpy = jasmine.createSpyObj("SnackbarService", [
      "showSuccess",
      "showError",
    ]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    heroesServiceSpy.getHeroById.and.returnValue(of(mockHero));
    heroesServiceSpy.createHero.and.returnValue(of(mockHero));
    heroesServiceSpy.updateHero.and.returnValue(of(mockHero));

    await TestBed.configureTestingModule({
      imports: [
        FormHeroComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TextInputComponent,
        HeroPreviewComponent,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: SnackbarService, useValue: snackbarServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    heroesService = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
    snackbarService = TestBed.inject(
      SnackbarService
    ) as jasmine.SpyObj<SnackbarService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("debería crear el componente", () => {
    expect(component).toBeTruthy();
  });

  it("debería inicializar el formulario con campos vacíos", () => {
    expect(component.formHero.get("name")?.value).toBe("");
    expect(component.formHero.get("realName")?.value).toBe("");
    expect(component.formHero.get("team")?.value).toBe("");
    expect(component.formHero.get("image")?.value).toBe("");
    expect(component.formHero.get("description")?.value).toBe("");
    expect(component.formHero.get("powers")?.value).toBe("");
    expect(component.formHero.get("firstAppearance")?.value).toBe("");
  });

  it("debería marcar los campos como inválidos cuando están vacíos", () => {
    const form = component.formHero;
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      control?.markAsTouched();
      expect(control?.valid).toBeFalsy();
    });
  });

  it("debería validar el formato de la URL de la imagen", () => {
    const imageControl = component.formHero.get("image");

    imageControl?.setValue("invalid-url");
    expect(imageControl?.valid).toBeFalsy();

    imageControl?.setValue("https://example.com/hero.jpg");
    expect(imageControl?.valid).toBeTruthy();
  });

  it("debería cargar los datos del héroe en modo edición", fakeAsync(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        FormHeroComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TextInputComponent,
        HeroPreviewComponent,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: HeroesService, useValue: heroesService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "1",
              },
            },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    tick();

    expect(heroesService.getHeroById).toHaveBeenCalledWith(1);
    expect(component.formHero.get("name")?.value).toBe(
      mockHero.name.toUpperCase()
    );
    expect(component.formHero.get("realName")?.value).toBe(mockHero.realName);
    expect(component.isEditMode()).toBeTrue();
  }));

  it("debería crear un nuevo héroe al enviar el formulario en modo creación", fakeAsync(() => {
    const newHero = {
      name: "IRON MAN",
      realName: "Tony Stark",
      team: "Marvel",
      image: "https://example.com/ironman.jpg",
      powers: "Genius,Technology",
      description: "Genius billionaire",
      firstAppearance: "1963",
    };

    component.formHero.patchValue(newHero);
    component.onSubmit();
    tick();

    const expectedHeroData = {
      ...newHero,
      powers: ["Genius", "Technology"],
      firstAppearance: 1963,
    };

    expect(heroesService.createHero).toHaveBeenCalledWith(expectedHeroData);
    expect(snackbarService.showSuccess).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
  }));

  it("debería actualizar un héroe existente en modo edición", fakeAsync(() => {
    component.heroId.set(1);
    component.isEditMode.set(true);

    const updatedHero = {
      name: "SPIDER-MAN",
      realName: "Peter Parker",
      team: "Marvel",
      image: "https://example.com/spiderman-updated.jpg",
      powers: "Web-shooting,Wall-crawling,Spider-sense",
      description: "Updated description",
      firstAppearance: "1962",
    };

    component.formHero.patchValue(updatedHero);
    component.onSubmit();
    tick();

    const expectedHeroData = {
      ...updatedHero,
      powers: ["Web-shooting", "Wall-crawling", "Spider-sense"],
      firstAppearance: 1962,
    };

    expect(heroesService.updateHero).toHaveBeenCalledWith(1, expectedHeroData);
    expect(snackbarService.showSuccess).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
  }));

  it("debería mostrar error cuando el héroe no existe en modo edición", fakeAsync(() => {
    heroesService.getHeroById.and.returnValue(of(undefined));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        FormHeroComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        TextInputComponent,
        HeroPreviewComponent,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: HeroesService, useValue: heroesService },
        { provide: SnackbarService, useValue: snackbarService },
        { provide: Router, useValue: router },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => "999",
              },
            },
          },
        },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    tick();

    expect(snackbarService.showError).toHaveBeenCalledWith(
      "Superhéroe no encontrado"
    );
    expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
  }));

  it("debería procesar correctamente los poderes como array", () => {
    const powers = "Vuelo, Super Fuerza,Invisibilidad";
    const processed = component["processPowers"](powers);
    expect(processed).toEqual(["Vuelo", "Super Fuerza", "Invisibilidad"]);
  });

  it("debería manejar poderes vacíos", () => {
    expect(component["processPowers"]("")).toEqual([]);
    expect(component["processPowers"]([])).toEqual([]);
  });
});
