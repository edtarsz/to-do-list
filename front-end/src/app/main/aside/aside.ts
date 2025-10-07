import { Component, inject } from '@angular/core';
import { ListService } from '../../global-services/lists.service';
import { AsideItem } from "./aside-item/aside-item";
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { AuthStateService } from '../../global-services/auth-state.service';
import { InterfaceService } from '../../global-services/interface.service';
import { IconTextButton } from '../../global-components/icon-text-button/icon-text-button';
import { AsideSection } from './aside-section/aside-section';
import { Router } from '@angular/router';

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

  public authStateService = inject(AuthStateService);
  private authService = inject(AuthService);
  private router = inject(Router);

  menu = this.iconRegistryService.getMenu();

  trashIcon = this.iconRegistryService.getIcon('trash');
  addIcon = this.iconRegistryService.getIcon('add');
  noteIcon = this.iconRegistryService.getIcon('note');
  calendarIcon = this.iconRegistryService.getIcon('calendar');

  // Initialize lists on aside load
  constructor() {
    this.listService.getLists().subscribe();
  }

  toggleAside() {
    if (this.interfaceService.deleteActive()) {
      this.interfaceService.toggleDeleteActive();
    }
    this.interfaceService.toggleAside();
  }

  toggleProfileSettings() {
    this.interfaceService.toggleProfileSettings();
  }

  togglePopUp() {
    this.interfaceService.setCurrentOperation('Add List');
  }

  toggleDeleteActive() {
    this.interfaceService.toggleDeleteActive();
  }

  deleteList(listId: number): void {
    if (this.interfaceService.deleteActive()) {
      this.listService.deleteList(listId).subscribe()
    } else if (this.interfaceService.selectedListId() !== listId) {
      this.interfaceService.selectedListId.set(listId);
    } else {
      this.interfaceService.selectedListId.set(null);
    }
  }

  toggleMenuSelection(menuId: number): void {
    if (this.interfaceService.selectedMenuId() !== menuId) {
      this.interfaceService.selectedMenuId.set(menuId);
    }
    switch (menuId) {
      case 1:
        this.router.navigate(['/index/tasks']);
        break;
      case 2:
        this.router.navigate(['/index/tasks']);
        break;
      // filter using params ?upcoming=true
      case 3:
        this.router.navigate(['/index/calendar']);
        break;
      default:
        this.router.navigate(['/index/tasks']);
        break;
    }
  }

  logOut() {
    this.interfaceService.closeAll();
    this.authService.logout();
  }
}
