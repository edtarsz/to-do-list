import { Component, inject } from '@angular/core';
import { Aside } from "./aside/aside";
import { InterfaceService } from '../global-services/interface.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [Aside, CommonModule, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  public interfaceService = inject(InterfaceService);
}
