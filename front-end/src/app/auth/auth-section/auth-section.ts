import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconTextButton } from "../../main/icon-text-button/icon-text-button";

@Component({
  selector: 'app-auth-section',
  imports: [RouterLink, IconTextButton],
  templateUrl: './auth-section.html',
  styleUrl: './auth-section.css'
})
export class AuthSection {
  @Input() title!: string;
  @Input() description!: string;
  @Input() route!: string;
  @Input() routeText!: string;
  
  @Input() buttonText!: string;
}
