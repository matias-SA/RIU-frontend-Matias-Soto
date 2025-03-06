import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { CardHeroComponent } from "./card-hero.component";
import { Hero } from "../../../core/interfaces/hero.interface";

describe("CardHeroComponent", () => {
  let component: CardHeroComponent;
  let fixture: ComponentFixture<CardHeroComponent>;

  const mockHero: Hero = {
    id: 1,
    name: "Spider-Man",
    team: "Marvel",
    image: "spiderman.jpg",
    firstAppearance: 1962,
    powers: ["Wall-crawling", "Spider-sense"],
    rating: 5,
    description: "Your friendly neighborhood Spider-Man",
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeroComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CardHeroComponent);
    component = fixture.componentInstance;
    component.hero = mockHero;
    fixture.detectChanges();
  });

  it("debería crear el componente", () => {
    expect(component).toBeTruthy();
  });

  it("debería mostrar la información del héroe correctamente", () => {
    const image = fixture.debugElement.query(By.css("img"));
    const title = fixture.debugElement.query(By.css("mat-card-title"));
    const subtitle = fixture.debugElement.query(By.css("mat-card-subtitle"));

    expect(image.attributes["src"]).toBe(mockHero.image);
    expect(image.attributes["alt"]).toBe(mockHero.name);
    expect(title.nativeElement.textContent).toContain(mockHero.name);
    expect(subtitle.nativeElement.textContent).toContain(mockHero.team);
  });

  it("debería tener tres botones con sus respectivos labels: editar, eliminar y ver", () => {
    const buttons = fixture.debugElement.queryAll(By.css("button"));

    expect(buttons.length).toBe(3);
    expect(buttons[0].nativeElement.textContent.trim()).toBe("Editar");
    expect(buttons[1].nativeElement.textContent.trim()).toBe("Eliminar");
    expect(buttons[2].nativeElement.textContent.trim()).toBe("Ver");
  });

  it("debería emitir el id del héroe al hacer click en editar", () => {
    const spy = spyOn(component.edit, "emit");
    const editButton = fixture.debugElement.queryAll(By.css("button"))[0];

    editButton.triggerEventHandler("click", null);

    expect(spy).toHaveBeenCalledWith(mockHero.id);
  });

  it("debería emitir el id del héroe al hacer click en eliminar", () => {
    const spy = spyOn(component.delete, "emit");
    const deleteButton = fixture.debugElement.queryAll(By.css("button"))[1];

    deleteButton.triggerEventHandler("click", null);

    expect(spy).toHaveBeenCalledWith(mockHero.id);
  });

  it("debería emitir el id del héroe al hacer click en ver", () => {
    const spy = spyOn(component.view, "emit");
    const viewButton = fixture.debugElement.queryAll(By.css("button"))[2];

    viewButton.triggerEventHandler("click", null);

    expect(spy).toHaveBeenCalledWith(mockHero.id);
  });

  it("debería aplicar los estilos de hover correctamente", () => {
    const card = fixture.debugElement.query(By.css(".hero-card"));

    const initialStyles = window.getComputedStyle(card.nativeElement);
    expect(initialStyles.transition).toContain("transform");
    expect(initialStyles.transition).toContain("box-shadow");
  });

  it("debería tener la estructura correcta de la card", () => {
    const card = fixture.debugElement.query(By.css("mat-card"));
    const header = fixture.debugElement.query(By.css("mat-card-header"));
    const actions = fixture.debugElement.query(By.css("mat-card-actions"));
    const image = fixture.debugElement.query(By.css("img[mat-card-image]"));

    expect(card).toBeTruthy();
    expect(header).toBeTruthy();
    expect(actions).toBeTruthy();
    expect(image).toBeTruthy();
  });
});
