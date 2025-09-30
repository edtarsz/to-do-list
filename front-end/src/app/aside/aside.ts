import { Component, inject, Signal } from '@angular/core';
import { ListService } from '../services/lists.service';
import { AsideItem } from "./aside-item/aside-item";
import { IconTextButton } from './icon-text-button/icon-text-button';
import { IconRegistryService } from '../services/icon-registry.service';
import { InterfaceService } from '../services/interface.service';
import { CommonModule } from '@angular/common';
import { AsideSection } from "./aside-section/aside-section";

@Component({
  selector: 'app-aside',
  imports: [AsideItem, IconTextButton, CommonModule, AsideSection],
  templateUrl: './aside.html',
  styleUrl: './aside.css'
})
export class Aside {
  public listService = inject(ListService);
  public iconRegistryService = inject(IconRegistryService);
  public interfaceService = inject(InterfaceService);

  trashIcon = this.iconRegistryService.getIcon('trash');
  addIcon = this.iconRegistryService.getIcon('add');
  noteIcon = this.iconRegistryService.getIcon('note');
  calendarIcon = this.iconRegistryService.getIcon('calendar');

  toggleAside() {
    this.interfaceService.toggleAside();
  }

  get showText() {
    return this.interfaceService.isAsideOpen();
  }
}
