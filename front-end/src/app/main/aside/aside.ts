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
import { List } from '../../models/list';

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
  penIcon = this.iconRegistryService.getIcon('pen');

  constructor() {
    this.listService.getLists().subscribe();
  }

  toggleAside() {
    if (this.interfaceService.deleteActive()) {
      this.interfaceService.toggleDeleteActive();
    }
    if (this.interfaceService.editActive()) {
      this.interfaceService.toggleEditActive();
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

  toggleEditActive() {
    this.interfaceService.toggleEditActive();
  }

  operate(list: List): void {
    if (!list.id) return;
    // Si la lista ya está seleccionada, deseleccionarla
    if (this.interfaceService.selectedList()?.id === list.id) {
      this.selectList(null);
    } else {
      this.selectList(list);
    }

    if (this.interfaceService.editActive()) {
      this.editList(list);
    } else if (this.interfaceService.deleteActive()) {
      this.deleteList(list.id);
    }
  }

  deleteList(listId: number): void {
    if (this.interfaceService.deleteActive()) {
      this.listService.deleteList(listId).subscribe({
        next: () => {
          this.interfaceService.setEventActive(true);
          this.interfaceService.setEvent('LIST DELETED', `List has been successfully deleted.`);
        }
      });
    }
  }

  // pending changes
  // para saber si está en modo edicion checo si está seleccionado alguna lista
  editList(list: List): void {
    if (this.interfaceService.editActive()) {
      this.interfaceService.selectedList.set(list);
      this.interfaceService.setCurrentOperation('Add List');
      this.interfaceService.togglePopUp();
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

    const currentList = this.interfaceService.selectedList();
    if (currentList) {
      queryParams.listId = currentList.id;
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

  selectList(list: List | null): void {
    this.interfaceService.selectedList.set(list);
    const queryParams: any = {};

    const currentMenuId = this.interfaceService.selectedMenuId();
    if (currentMenuId === 1) {
      queryParams.view = 'today';
    } else if (currentMenuId === 2) {
      queryParams.view = 'upcoming';
    }

    if (list) {
      queryParams.listId = list.id;
    }

    this.router.navigate(['/index/tasks'], { queryParams });
  }

  logOut() {
    this.interfaceService.closeAll();
    this.authService.logout();
  }
}