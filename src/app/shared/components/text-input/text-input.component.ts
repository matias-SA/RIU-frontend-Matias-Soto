import {
  AfterViewInit,
  Component,
  ElementRef,
  Optional,
  ViewChild,
  ViewEncapsulation,
  input,
  computed,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormsModule,
  FormControl,
  ControlContainer,
  FormControlDirective,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-text-input",
  templateUrl: "./text-input.component.html",
  styleUrls: ["./text-input.component.scss"],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextInputComponent,
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TextInputComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;

  @ViewChild("inputRef", { static: false })
  inputRef!: ElementRef<HTMLInputElement>;

  formControl = input<FormControl | null>(null);

  formControlName = input.required<string>();

  label = input.required<string>();

  placeholder = input.required<string>();

  prefixIcon = input<string | undefined>(undefined);

  autofocus = input<boolean>(false);

  readonly control = computed(() => {
    return (this.formControl() ||
      this._controlContainer.control?.get(
        this.formControlName()
      )) as FormControl;
  });

  constructor(@Optional() private _controlContainer: ControlContainer) {}

  ngAfterViewInit(): void {
    if (this.autofocus()) {
      setTimeout(() => {
        this.inputRef.nativeElement.focus();
      }, 0);
    }
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnTouched(fn);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor?.registerOnChange(fn);
  }

  writeValue(obj: any): void {
    this.formControlDirective.valueAccessor?.writeValue(obj);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor?.setDisabledState?.(isDisabled);
  }
}
