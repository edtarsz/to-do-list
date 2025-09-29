import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-icon-text-button',
  imports: [],
  templateUrl: './icon-text-button.html',
  styleUrl: './icon-text-button.css'
})
export class IconTextButton {
  @Input() bgColor: string = 'transparent';
  @Input() borderColor: string = 'var(--purple)';
  @Input() textColor: string = 'var(--light)';

  @Input() iconSize: string = '21';
  @Input() iconSvg!: string;
  @Input() text!: string;

  @Output() click = new EventEmitter<void>();

  onMouseEnter() {
    this.bgColor = 'var(--purple)';
    this.textColor = 'white';
    this.borderColor = 'var(--purple)';
  }

  onMouseLeave() {
    this.bgColor = 'transparent';
    this.textColor = this.borderColor;
  }
}
