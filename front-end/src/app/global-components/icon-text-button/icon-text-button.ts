import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-icon-text-button',
  imports: [CommonModule],
  templateUrl: './icon-text-button.html',
  styleUrl: './icon-text-button.css'
})
export class IconTextButton {
  private sanitizer = inject(DomSanitizer);

  @Input() bgColor?: string;
  @Input() bgColorHover?: string;

  @Input() borderColor?: string;

  @Input() color?: string;
  @Input() colorHover?: string;

  @Input() text?: string;

  @Input() iconSize: string = '21';
  @Input() iconSvg!: string;
  @Input() viewBox: string = '0 0 24 24';

  @Input() isActive: boolean = false;

  @Output() buttonClick = new EventEmitter<void>();
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  hover = false;

  sanitizeSvg(svg: string) {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  onMouseEnter() {
    this.hover = true;
  }

  onMouseLeave() {
    this.hover = false;
  }

  onClick() {
    this.buttonClick.emit();
  }

  get currentBgColor() {
    if (this.isActive) {
      return this.bgColorHover;
    }

    return this.hover ? this.bgColorHover : this.bgColor ?? 'transparent';
  }

  get currentTextColor() {
    if (this.isActive) {
      return this.colorHover;
    }

    return this.hover
      ? this.colorHover ?? this.color ?? 'transparent'
      : this.color ?? 'transparent';
  }
}