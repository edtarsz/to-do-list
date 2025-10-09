import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListService } from '../../global-services/lists.service';
import { AsideItem } from "./aside-item/aside-item";
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { AuthService } from '../../auth/auth.service';
import { AuthStateService } from '../../global-services/auth-state.service';
import { InterfaceService } from '../../global-services/interface.service';
import { IconTextButton } from '../../global-components/icon-text-button/icon-text-button';
import { AsideSection } from './aside-section/aside-section';

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
    this.interfaceService.togglePopUp();
    this.interfaceService.setCurrentOperation('Add List');
  }

  toggleDeleteActive() {
    this.interfaceService.toggleDeleteActive();
  }

  deleteList(listId: number): void {
    if (this.interfaceService.deleteActive()) {
      this.listService.deleteList(listId).subscribe({
        next: () => {
          this.interfaceService.setEventActive(true);
          this.interfaceService.setEvent('LIST DELETED', `List has been successfully deleted.`);
        }
      });
    } else if (this.interfaceService.selectedListId() !== listId) {
      this.selectList(listId);
    } else {
      this.selectList(null);
    }
  }

  toggleMenuSelection(menuId: number): void {
    this.interfaceService.selectedMenuId.set(menuId);

    const queryParams: any = {};

    if (menuId === 1) {
      queryParams.view = 'today';
    } else if (menuId === 2) {
      queryParams.view = 'upcoming';
    }

    const currentListId = this.interfaceService.selectedListId();
    if (currentListId) {
      queryParams.listId = currentListId;
    }

    switch (menuId) {
      case 1:
      case 2:
        this.router.navigate(['/index/tasks'], { queryParams });
        break;
      case 3:
        this.router.navigate(['/index/calendar']);
        break;
      default:
        this.router.navigate(['/index/tasks'], { queryParams });
        break;
    }
  }

  selectList(listId: number | null): void {
    this.interfaceService.selectedListId.set(listId);
    const queryParams: any = {};

    const currentMenuId = this.interfaceService.selectedMenuId();
    if (currentMenuId === 1) {
      queryParams.view = 'today';
    } else if (currentMenuId === 2) {
      queryParams.view = 'upcoming';
    }

    if (listId) {
      queryParams.listId = listId;
    }

    this.router.navigate(['/index/tasks'], { queryParams });
  }

  logOut() {
    this.interfaceService.closeAll();
    this.authService.logout();
  }
}