import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { InterfaceService } from '../../../services/interface.service';

@Component({
  selector: 'app-aside-section',
  imports: [CommonModule],
  templateUrl: './aside-section.html',
  styleUrl: './aside-section.css'
})
export class AsideSection {
  public interfaceService = inject(InterfaceService);

  @Input() title!: string;
  @Input() showText: boolean = true;
}
