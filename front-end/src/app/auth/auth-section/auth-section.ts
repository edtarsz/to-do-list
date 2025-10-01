import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconTextButton } from "../../main/icon-text-button/icon-text-button";
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-section',
  imports: [RouterLink, IconTextButton, ReactiveFormsModule],
  templateUrl: './auth-section.html',
  styleUrl: './auth-section.css'
})
export class AuthSection {
  @Input() title!: string;
  @Input() description!: string;
  @Input() route!: string;
  @Input() routeText!: string;

  @Input() buttonAction!: string;
  @Input() buttonText!: string;

  @Input() formGroup!: FormGroup;
  @Output() formSubmit = new EventEmitter<void>();

  onSubmit(){
    this.formSubmit.emit();
  }
}
