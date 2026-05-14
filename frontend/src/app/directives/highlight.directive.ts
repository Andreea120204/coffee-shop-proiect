import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject,
} from '@angular/core';

// Directiva pt highlight la hover
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  @Input() appHighlight = '';

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly defaultColor = '#fff7ed';

  @HostListener('mouseenter') onMouseEnter(): void {
    this.aplicaCuloare(this.appHighlight || this.defaultColor);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.aplicaCuloare('');
  }

  private aplicaCuloare(culoare: string): void {
    this.el.nativeElement.style.backgroundColor = culoare;
    this.el.nativeElement.style.transition = 'background-color 0.2s ease';
  }
}
