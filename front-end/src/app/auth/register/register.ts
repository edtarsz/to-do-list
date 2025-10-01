import { Component } from '@angular/core';
import { IconTextButton } from "../../main/icon-text-button/icon-text-button";
import { AuthSection } from "../auth-section/auth-section";

@Component({
  selector: 'app-register',
  imports: [IconTextButton, AuthSection],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

}
