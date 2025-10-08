import { Component, inject } from '@angular/core';
import { Aside } from "./aside/aside";
import { InterfaceService } from '../global-services/interface.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AddTask } from "./operations/add-task/add-task";
import { AddList } from "./operations/add-list/add-list";
import { PopUp } from '../global-components/pop-up/pop-up';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-main',
  imports: [Aside, CommonModule, RouterOutlet, PopUp, AddTask, AddList],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  private router = inject(Router);
  private interfaceService = inject(InterfaceService);

  ngOnInit() {
    this.syncMenuWithRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.syncMenuWithRoute(event.urlAfterRedirects);
    });
  }

  private syncMenuWithRoute(url: string) {
    switch (true) {
      case url.includes('tasks'):
        this.interfaceService.selectedMenuId.set(1);
        break;
      case url.includes('calendar'):
        this.interfaceService.selectedMenuId.set(3);
        break;
    }
  }

  get currentOperation() {
    return this.interfaceService.currentOperation();
  }

  get isPopUpOpen() {
    return this.interfaceService.isPopUpOpen();
  }

  get isAsideOpen() {
    return this.interfaceService.isAsideOpen();
  }
}
