import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-icon-text-button',
  imports: [],
  templateUrl: './icon-text-button.html',
  styleUrl: './icon-text-button.css'
})
export class IconTextButton {
  private sanitizer = inject(DomSanitizer);

  @Input() bgColor!: string;
  @Input() borderColor!: string;
  @Input() textColor!: string;
  @Input() text!: string;

  @Input() iconSize: string = '21';
  @Input() iconSvg!: string;
  @Input() viewBox: string = '0 0 24 24';

  sanitizeSvg(svg: string) {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  onMouseEnter() {
    this.bgColor = this.borderColor;
    this.textColor = 'white';
  }

  onMouseLeave() {
    this.bgColor = 'transparent';
    this.textColor = this.borderColor;
  }
}
