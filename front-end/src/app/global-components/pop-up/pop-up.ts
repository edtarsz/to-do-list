import { Component, inject, Input } from '@angular/core';
import { IconTextButton } from "../icon-text-button/icon-text-button";
import { InterfaceService } from '../../global-services/interface.service';
import { IconRegistryService } from '../../global-services/icon-registry.service';

@Component({
  selector: 'app-pop-up',
  imports: [IconTextButton],
  templateUrl: './pop-up.html',
  styleUrl: './pop-up.css'
})
export class PopUp {
  private interfaceService = inject(InterfaceService);
  private iconRegistryService = inject(IconRegistryService);

  closeIcon = this.iconRegistryService.getIcon('close');

  @Input() title = 'Title';

  togglePopUp() {
    if (this.interfaceService.selectedTask()) {
      this.interfaceService.selectedTask.set(null);
    }
    if (this.interfaceService.selectedList()) {
      // this.interfaceService.selectedList.set(null);
    }
    this.interfaceService.togglePopUp();
  }

  get titleText() {
    if (this.interfaceService.selectedTask() && this.interfaceService.editActiveTask()) {
      this.title = 'Edit Task';
    } else if (this.interfaceService.selectedList() && this.interfaceService.editActiveList()) {
      this.title = 'Edit List';
    }
    return this.title;
  }
}
