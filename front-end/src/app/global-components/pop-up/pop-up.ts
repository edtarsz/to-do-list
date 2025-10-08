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
    this.interfaceService.togglePopUp();
  }

  get titleText() {
    if (this.interfaceService.selectedListId()) {
      this.title = 'Edit List';
    }
    return this.title;
  }
}
