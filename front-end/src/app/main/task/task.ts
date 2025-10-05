import { Component, inject } from "@angular/core";
import { AuthStateService } from "../../global-services/auth-state.service";
import { IconRegistryService } from "../../global-services/icon-registry.service";
import { InterfaceService } from "../../global-services/interface.service";
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { RelojService } from "../../global-services/reloj-service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-task',
  imports: [IconTextButton, AsyncPipe],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task {
  public authStateService = inject(AuthStateService);
  public iconRegistryService = inject(IconRegistryService);
  public interfaceService = inject(InterfaceService)
  private relojService = inject(RelojService);

  sendIcon = this.iconRegistryService.getIcon('send')

  togglePopUp() {
    this.interfaceService.setCurrentOperation('Add Task');
  }

  getTitle() {
    return this.iconRegistryService.getMenu()[this.interfaceService.selectedMenuId() - 1].name;
  }

  get dateAndTime() {
    return this.relojService.getFechaHora();
  }
}