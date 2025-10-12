import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
    if (this.interfaceService.editActiveList()) {
      this.interfaceService.setEditActiveList(false);
    }
    this.interfaceService.toggleAside();
  }

  toggleProfileSettings() {
    this.interfaceService.toggleProfileSettings();
  }

  togglePopUp() {
    if (this.interfaceService.editActiveList()) {
      this.interfaceService.setEditActiveList(false);
    }
    if (this.interfaceService.deleteActive()) {
      this.interfaceService.toggleDeleteActive();
    }

    this.interfaceService.togglePopUp();
    this.interfaceService.setCurrentOperation('Add List');
  }

  toggleDeleteActive() {
    this.interfaceService.toggleDeleteActive();
  }

  toggleEditActiveList() {
    if (this.interfaceService.editActiveList()) {
      this.interfaceService.setEditActiveList(false);
    } else {
      this.interfaceService.setEditActiveList(true);
    }
  }

  operate(list: List): void {
    if (!list.id) return;

    if (this.interfaceService.editActiveList()) {
      this.editList(list);
      return;
    } else if (this.interfaceService.deleteActive()) {
      this.deleteList(list.id);
      return;
    }

    if (this.interfaceService.selectedList()?.id === list.id) {
      this.selectList(null);
    } else {
      this.selectList(list);
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
    if (this.interfaceService.editActiveList()) {
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
      this.interfaceService.setShowCompletedTasks(false);
    } else if (menuId === 2) {
      queryParams.view = 'upcoming';
      this.interfaceService.setShowCompletedTasks(false);
    } else if (menuId === 4) {
      queryParams.view = 'completed';
      this.interfaceService.setShowCompletedTasks(true);
    }

    // Mantener la lista seleccionada en todos los menús
    const currentList = this.interfaceService.selectedList();
    if (currentList) {
      queryParams.listId = currentList.id;
    }

    switch (menuId) {
      case 1:
      case 2:
      case 4:
        // Para todos los menús con tareas, mantener query params
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
    } else if (currentMenuId === 4) {
      queryParams.view = 'completed';
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

  navigateToUpdateProfile() {
    this.interfaceService.toggleProfileSettings();
    this.router.navigate(['/index/update-profile']);
  }
}