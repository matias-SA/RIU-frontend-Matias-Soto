import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { LoadingSpinnerComponent } from "./loading-spinner.component";
import { LoadingService } from "../../../core/services/loading.service";
import { BehaviorSubject } from "rxjs";

describe("LoadingSpinnerComponent", () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    loadingService = jasmine.createSpyObj("LoadingService", [], {
      loading$: loadingSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent, NoopAnimationsModule],
      providers: [{ provide: LoadingService, useValue: loadingService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("debería crear el componente", () => {
    expect(component).toBeTruthy();
  });

  it("no debería mostrar el spinner cuando loading es false", () => {
    loadingSubject.next(false);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css(".loading-overlay"));
    expect(overlay).toBeFalsy();
  });

  it("debería mostrar el spinner cuando loading es true", () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css(".loading-overlay"));
    const spinner = fixture.debugElement.query(By.css("mat-spinner"));
    const loadingText = fixture.debugElement.query(By.css(".loading-text"));

    expect(overlay).toBeTruthy();
    expect(spinner).toBeTruthy();
    expect(loadingText.nativeElement.textContent).toBe("Loading...");
  });

  it("debería tener los estilos correctos para el overlay", () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css(".loading-overlay"));
    const styles = window.getComputedStyle(overlay.nativeElement);

    expect(styles.position).toBe("fixed");
    expect(styles.zIndex).toBe("9999");
    expect(styles.backgroundColor).toContain("rgba(0, 0, 0, 0.5)");
  });

  it("debería responder a cambios en el estado de loading", () => {
    let overlay = fixture.debugElement.query(By.css(".loading-overlay"));
    expect(overlay).toBeFalsy();

    loadingSubject.next(true);
    fixture.detectChanges();
    overlay = fixture.debugElement.query(By.css(".loading-overlay"));
    expect(overlay).toBeTruthy();

    loadingSubject.next(false);
    fixture.detectChanges();
    overlay = fixture.debugElement.query(By.css(".loading-overlay"));
    expect(overlay).toBeFalsy();
  });
});
