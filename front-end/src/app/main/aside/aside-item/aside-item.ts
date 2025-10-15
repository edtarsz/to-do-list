import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InterfaceService } from '../../../global-services/interface.service';

@Component({
  selector: 'app-aside-item',
  imports: [CommonModule],
  templateUrl: './aside-item.html',
  styleUrl: './aside-item.css'
})
export class AsideItem {
  private sanitizer = inject(DomSanitizer);
  private interfaceService = inject(InterfaceService);

  @Input() title!: string;
  @Input() color!: string;
  @Input() bgColorHover?: string;
  @Input() borderColor?: string;

  @Input() viewBox: string = '0 0 24 24';
  @Input() iconSvg!: string;
  @Input() iconSize: string = '21';

  @Input() showText: boolean = true;
  @Input() selected: boolean = false;

  @Input() deleting: boolean = false;
  @Input() editing: boolean = false;

  sanitizeSvg(svg: string) {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  get isAsideOpen() {
    return this.interfaceService.isAsideOpen();
  }
}
