import { Component, inject } from '@angular/core';
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { InterfaceService } from '../../global-services/interface.service';
import { Router } from '@angular/router';
import { AuthStateService } from '../../global-services/auth-state.service';

@Component({
  selector: 'app-update-profile',
  imports: [IconTextButton],
  templateUrl: './update-profile.html',
  standalone: true,
  styleUrl: './update-profile.css'
})
export class UpdateProfile {
  private iconRegistryService = inject(IconRegistryService);
  private interfaceService = inject(InterfaceService);
  private router = inject(Router);

  closeIcon = this.iconRegistryService.getIcon('close');

  closeUpdateProfile() {
    this.interfaceService.setShowUpdateProfile(false);
    this.router.navigate(['/index/tasks']);
  }
}
