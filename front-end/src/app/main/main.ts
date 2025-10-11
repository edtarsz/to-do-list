import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Aside } from "./aside/aside";
import { InterfaceService } from '../global-services/interface.service';
import { AddTask } from "./operations/add-task/add-task";
import { AddList } from "./operations/add-list/add-list";
import { PopUp } from '../global-components/pop-up/pop-up';
import { Event } from "../global-components/event/event";
import { AuthStateService } from '../global-services/auth-state.service';
import { Loading } from "../global-components/loading/loading";
import { ListService } from '../global-services/lists.service';

@Component({
  selector: 'app-main',
  imports: [Aside, CommonModule, RouterOutlet, PopUp, AddTask, AddList, Event, Loading],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  private router = inject(Router);
  private interfaceService = inject(InterfaceService);
  private authStateService = inject(AuthStateService);
  private listService = inject(ListService);

  ngOnInit() {
    this.syncMenuWithRoute();

    // Sincronizar en cada navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.syncMenuWithRoute();
    });
  }

  private syncMenuWithRoute() {
    const url = this.router.url;

    if (url.includes('update-profile')) {
      this.interfaceService.setShowUpdateProfile(true);
      return;
    } else {
      this.interfaceService.setShowUpdateProfile(false);
    }

    // Extraer query params de la URL
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const view = urlParams.get('view');
    const listId = urlParams.get('listId');

    if (url.includes('tasks')) {
      if (view === 'upcoming') {
        this.interfaceService.selectedMenuId.set(2);
      } else {
        this.interfaceService.selectedMenuId.set(1);
      }

      if (listId) {
        this.listService.getListById(Number(listId)).subscribe({
          next: (list) => this.interfaceService.selectedList.set(list),
          error: () => this.interfaceService.selectedList.set(null)
        });
      } else {
        this.interfaceService.selectedList.set(null);
      }
    } else if (url.includes('calendar')) {
      this.interfaceService.selectedMenuId.set(3);
    }
  }

  get currentOperation(): string {
    return this.interfaceService.currentOperation();
  }

  get isPopUpOpen(): boolean {
    return this.interfaceService.isPopUpOpen();
  }

  get isAsideOpen(): boolean {
    return this.interfaceService.isAsideOpen();
  }

  get userName(): string | undefined {
    return this.authStateService.user()?.name;
  }

  get isEventActive(): boolean {
    return this.interfaceService.isEventActive();
  }

  get isLoading(): boolean {
    return this.authStateService.isLoading();
  }

  get showUpdateProfile(): boolean {
    return this.interfaceService.showUpdateProfile();
  }
}