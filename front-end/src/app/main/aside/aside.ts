import { Component, inject, Signal } from '@angular/core';
import { ListService } from '../../services/lists.service';
import { AsideItem } from "./aside-item/aside-item";
import { IconRegistryService } from '../../services/icon-registry.service';
import { InterfaceService } from '../../services/interface.service';
import { CommonModule } from '@angular/common';
import { AsideSection } from "./aside-section/aside-section";
import { AddList } from "./operations/add-list/add-list";
import { IconTextButton } from '../icon-text-button/icon-text-button';

@Component({
  selector: 'app-aside',
  imports: [AsideItem, IconTextButton, CommonModule, AsideSection, AddList],
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
    if (this.interfaceService.deleteActive()) {
      this.interfaceService.toggleDeleteActive();
    }
    this.interfaceService.toggleAside();
  }

  toggleProfileSettings() {
    this.interfaceService.toggleProfileSettings();
  }

  toggleAddList() {
    this.interfaceService.toggleAddList();
  }

  toggleDeleteActive() {
    this.interfaceService.toggleDeleteActive();
  }
}
