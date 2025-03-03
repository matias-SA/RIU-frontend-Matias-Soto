import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import HeroPreviewComponent from "./hero-preview.component";
import { Hero } from "@core/interfaces/hero.interface";
import { Component } from "@angular/core";

@Component({
  template: ` <app-hero-preview [hero]="hero"></app-hero-preview> `,
})
class TestHostComponent {
  hero?: Hero;
}

describe("HeroPreviewComponent", () => {
  let component: TestHostComponent;
  let heroPreviewComponent: HeroPreviewComponent;
  let fixture: ComponentFixture<TestHostComponent>;

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
    await TestBed.configureTestingModule({
      imports: [HeroPreviewComponent],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    heroPreviewComponent = fixture.debugElement.query(
      By.directive(HeroPreviewComponent)
    ).componentInstance;
  });

  it("debería crear el componente", () => {
    expect(heroPreviewComponent).toBeTruthy();
  });

  it("debería mostrar la información del héroe cuando se proporciona", () => {
    component.hero = mockHero;
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css("h3"));
    const realNameElement = fixture.debugElement.query(
      By.css(".preview-real-name")
    );
    const descriptionElement = fixture.debugElement.query(
      By.css(".preview-description")
    );
    const imageElement = fixture.debugElement.query(By.css("img"));

    expect(nameElement.nativeElement.textContent).toBe(mockHero.name);
    expect(realNameElement.nativeElement.textContent).toBe(mockHero.realName);
    expect(descriptionElement.nativeElement.textContent).toBe(
      mockHero.description
    );
    expect(imageElement.nativeElement.src).toContain(mockHero.image);
  });

  it("debería mostrar valores por defecto cuando no se proporciona héroe", () => {
    fixture.detectChanges();

    const nameElement = fixture.debugElement.query(By.css("h3"));
    const realNameElement = fixture.debugElement.query(
      By.css(".preview-real-name")
    );
    const descriptionElement = fixture.debugElement.query(
      By.css(".preview-description")
    );

    expect(nameElement.nativeElement.textContent).toBe("Nombre del Superhéroe");
    expect(realNameElement.nativeElement.textContent).toBe("Nombre Real");
    expect(descriptionElement.nativeElement.textContent).toBe(
      "Descripción del superhéroe"
    );
  });

  it("debería identificar correctamente un héroe de Marvel", () => {
    component.hero = { ...mockHero, team: "Marvel" };
    fixture.detectChanges();
    expect(heroPreviewComponent.isMarvelTeam()).toBeTrue();
    expect(heroPreviewComponent.isDCTeam()).toBeFalse();
  });

  it("debería identificar correctamente un héroe de DC", () => {
    component.hero = { ...mockHero, team: "DC" };
    fixture.detectChanges();
    expect(heroPreviewComponent.isDCTeam()).toBeTrue();
    expect(heroPreviewComponent.isMarvelTeam()).toBeFalse();
  });

  it("debería aplicar la clase CSS correcta según el equipo", () => {
    // Probar equipo Marvel
    component.hero = { ...mockHero, team: "Marvel" };
    fixture.detectChanges();
    let teamElement = fixture.debugElement.query(By.css(".preview-team"));
    expect(teamElement.nativeElement.classList.contains("marvel")).toBeTrue();

    // Probar equipo DC
    component.hero = { ...mockHero, team: "DC" };
    fixture.detectChanges();
    teamElement = fixture.debugElement.query(By.css(".preview-team"));
    expect(teamElement.nativeElement.classList.contains("dc")).toBeTrue();

    // Probar equipo desconocido
    component.hero = { ...mockHero, team: "Otro" };
    fixture.detectChanges();
    teamElement = fixture.debugElement.query(By.css(".preview-team"));
    expect(teamElement.nativeElement.classList.contains("default")).toBeTrue();
  });
});
