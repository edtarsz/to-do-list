import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../global-services/auth-state.service';
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { IconTextButton } from "../icon-text-button/icon-text-button";
import { InterfaceService } from '../../global-services/interface.service';

@Component({
  selector: 'app-task',
  imports: [IconTextButton],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task {
  public authStateService = inject(AuthStateService);
  public iconRegistryService = inject(IconRegistryService);
  public interfaceService = inject(InterfaceService)

  getTitle() {
    return this.iconRegistryService.getMenu()[this.interfaceService.selectedMenuId() - 1].name;
  }
}