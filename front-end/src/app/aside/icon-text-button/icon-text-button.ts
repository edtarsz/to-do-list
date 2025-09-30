import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output } from '@angular/core';
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
  @Input() borderColor?: string;
  @Input() bgColorHover?: string;

  @Input() textColor?: string;
  @Input() text?: string;

  @Input() iconSize: string = '21';
  @Input() iconSvg!: string;
  @Input() viewBox: string = '0 0 24 24';

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

  get currentBgColor() {
    return this.hover ? this.bgColorHover : this.bgColor ?? 'transparent';
  }

  get currentTextColor() {
    return this.hover ? 'white' : this.textColor ?? this.borderColor;
  }
}
