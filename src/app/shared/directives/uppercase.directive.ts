import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject,
} from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[appUppercase]",
  standalone: true,
})
export class UppercaseDirective {
  private el = inject(ElementRef);
  private control = inject(NgControl, { optional: true });
  @Input("appUppercase") enabled: boolean = true;

  @HostListener("input", ["$event"])
  onInput(event: InputEvent) {
    if (!this.enabled) return;

    const input = this.el.nativeElement as HTMLInputElement;
    const start = input.selectionStart;
    const value = input.value.toUpperCase();
    input.value = value;
    input.setSelectionRange(start, start);

    if (this.control?.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }

    const newEvent = new InputEvent("input", {
      bubbles: true,
      cancelable: true,
      data: value,
    });
    input.dispatchEvent(newEvent);
  }
}
