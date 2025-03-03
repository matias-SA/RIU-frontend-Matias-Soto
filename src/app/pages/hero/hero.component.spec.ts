import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import HeroComponent from "./hero.component";
import { HeroesService } from "../../core/services/heroes.service";
import { Hero } from "../../core/interfaces/hero.interface";
import RaitingComponent from "./raiting/raiting.component";

describe("HeroComponent", () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let heroesService: jasmine.SpyObj<HeroesService>;
  let router: jasmine.SpyObj<Router>;
  let route: any;

  const mockHero: Required<Hero> = {
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
    ]);
    const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);

    await TestBed.configureTestingModule({
      imports: [HeroComponent, NoopAnimationsModule, RaitingComponent],
      providers: [
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([["id", "1"]])),
          },
        },
      ],
    }).compileComponents();

    heroesService = TestBed.inject(
      HeroesService
    ) as jasmine.SpyObj<HeroesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    heroesService.getHeroById.and.returnValue(of(mockHero));
    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
  });

  it("debería crear el componente", () => {
    expect(component).toBeTruthy();
  });

  it("debería cargar el héroe al inicializar", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(heroesService.getHeroById).toHaveBeenCalledWith(1);
    expect(component.hero()).toEqual(mockHero);
  }));

  it("debería mostrar la información del héroe correctamente", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const nameElement = fixture.debugElement.query(By.css(".hero-name"));
    const realNameElement = fixture.debugElement.query(
      By.css(".hero-real-name")
    );
    const descriptionElement = fixture.debugElement.query(
      By.css(".hero-description")
    );
    const imageElement = fixture.debugElement.query(By.css(".hero-image"));
    const teamElement = fixture.debugElement.query(By.css(".hero-team-badge"));
    const powersElements = fixture.debugElement.queryAll(By.css("mat-chip"));

    expect(nameElement.nativeElement.textContent).toBe(mockHero.name);
    expect(realNameElement.nativeElement.textContent).toBe(mockHero.realName);
    expect(descriptionElement.nativeElement.textContent).toBe(
      mockHero.description
    );
    expect(imageElement.nativeElement.src).toContain(mockHero.image);
    expect(teamElement.nativeElement.textContent.trim()).toBe(mockHero.team);
    expect(powersElements.length).toBe(mockHero.powers?.length);
  }));

  it("debería aplicar la clase CSS correcta según el equipo", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const teamElement = fixture.debugElement.query(By.css(".hero-team-badge"));
    expect(teamElement.nativeElement.classList.contains("marvel")).toBeTrue();

    // Cambiar el equipo a DC
    component.hero.set({ ...mockHero, team: "DC" });
    fixture.detectChanges();
    expect(teamElement.nativeElement.classList.contains("dc")).toBeTrue();
  }));

  it("debería navegar al dashboard cuando el id no es válido", fakeAsync(() => {
    route.paramMap = of(new Map([["id", "invalid"]]));
    fixture.detectChanges();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
  }));

  it("debería navegar al dashboard cuando el héroe no existe", fakeAsync(() => {
    heroesService.getHeroById.and.returnValue(of(undefined));
    fixture.detectChanges();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
  }));

  it("debería mostrar la información adicional correctamente", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const firstAppearanceElement = fixture.debugElement.query(
      By.css(".info-value")
    );
    const teamValueElement = fixture.debugElement.queryAll(
      By.css(".info-value")
    )[1];

    const expectedYear = mockHero.firstAppearance?.toString() || "";
    expect(firstAppearanceElement.nativeElement.textContent.trim()).toBe(
      expectedYear
    );
    expect(teamValueElement.nativeElement.textContent.trim()).toBe(
      mockHero.team
    );
  }));

  it("debería aplicar las clases de color de texto según el equipo", fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const teamValueElement = fixture.debugElement.queryAll(
      By.css(".info-value")
    )[1];
    expect(
      teamValueElement.nativeElement.classList.contains("marvel-text")
    ).toBeTrue();

    // Cambiar el equipo a DC
    component.hero.set({ ...mockHero, team: "DC" });
    fixture.detectChanges();
    expect(
      teamValueElement.nativeElement.classList.contains("dc-text")
    ).toBeTrue();
  }));
});
