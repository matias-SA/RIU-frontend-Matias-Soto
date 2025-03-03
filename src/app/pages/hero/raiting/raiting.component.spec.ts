import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Component } from "@angular/core";
import RaitingComponent from "./raiting.component";

@Component({
  template: `<app-raiting [rating]="rating"></app-raiting>`,
})
class TestHostComponent {
  rating?: number;
}

describe("RaitingComponent", () => {
  let component: TestHostComponent;
  let raitingComponent: RaitingComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaitingComponent, NoopAnimationsModule],
      declarations: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    raitingComponent = fixture.debugElement.query(
      By.directive(RaitingComponent)
    ).componentInstance;
  });

  it("debería crear el componente", () => {
    expect(raitingComponent).toBeTruthy();
  });

  it("debería mostrar el número correcto de estrellas para un rating de 5", () => {
    component.rating = 5;
    fixture.detectChanges();

    const filledStars = fixture.debugElement
      .queryAll(By.css("mat-icon"))
      .filter((el) => el.nativeElement.textContent.trim() === "star");

    const emptyStars = fixture.debugElement
      .queryAll(By.css("mat-icon"))
      .filter((el) => el.nativeElement.textContent.trim() === "star_border");

    const ratingValue = fixture.debugElement.query(By.css(".rating-value"));

    expect(filledStars.length).toBe(5);
    expect(emptyStars.length).toBe(5);
    expect(ratingValue.nativeElement.textContent).toBe("5/10");
  });

  it("debería mostrar el número correcto de estrellas para el rating máximo (10)", () => {
    component.rating = 10;
    fixture.detectChanges();

    const filledStars = fixture.debugElement
      .queryAll(By.css("mat-icon"))
      .filter((el) => el.nativeElement.textContent.trim() === "star");

    const emptyStars = fixture.debugElement
      .queryAll(By.css("mat-icon"))
      .filter((el) => el.nativeElement.textContent.trim() === "star_border");

    const ratingValue = fixture.debugElement.query(By.css(".rating-value"));

    expect(filledStars.length).toBe(10);
    expect(emptyStars.length).toBe(0);
    expect(ratingValue.nativeElement.textContent).toBe("10/10");
  });

  it("debería mostrar todos los elementos de la interfaz", () => {
    fixture.detectChanges();

    const ratingLabel = fixture.debugElement.query(By.css(".rating-label"));
    const starsContainer = fixture.debugElement.query(By.css(".stars"));
    const ratingValue = fixture.debugElement.query(By.css(".rating-value"));

    expect(ratingLabel).toBeTruthy();
    expect(starsContainer).toBeTruthy();
    expect(ratingValue).toBeTruthy();
    expect(ratingLabel.nativeElement.textContent).toBe("Calificación:");
  });

  it("debería manejar valores undefined mostrando 0 estrellas", async () => {
    component.rating = undefined;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(raitingComponent.rating()).toBe(0);

    const filledStars = fixture.debugElement
      .queryAll(By.css("mat-icon"))
      .filter((el) => el.nativeElement.textContent.trim() === "star");

    const emptyStars = fixture.debugElement
      .queryAll(By.css("mat-icon"))
      .filter((el) => el.nativeElement.textContent.trim() === "star_border");

    const ratingValue = fixture.debugElement.query(By.css(".rating-value"));

    expect(filledStars.length).toBe(0);
    expect(emptyStars.length).toBe(10);
    expect(ratingValue.nativeElement.textContent).toBe("0/10");
  });

  it("debería mantener el total de estrellas en 10", () => {
    const ratings = [0, 3, 7, 10];

    ratings.forEach((rating) => {
      component.rating = rating;
      fixture.detectChanges();

      const totalStars = fixture.debugElement.queryAll(
        By.css("mat-icon")
      ).length;
      expect(totalStars).toBe(10, `Total de estrellas para rating ${rating}`);
    });
  });
});
