import { Component, inject } from '@angular/core';
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { IconRegistryService } from '../../global-services/icon-registry.service';

@Component({
  selector: 'app-calendar',
  imports: [IconTextButton],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar {
  iconRegistryService = inject(IconRegistryService);
  arrowBackIcon = this.iconRegistryService.getIcon('arrow_downwards');
  arrowNextIcon = this.iconRegistryService.getIcon('arrow_list');
}
