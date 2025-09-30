import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Main } from './main/main';
import { Aside } from './aside/aside';
import { CommonModule } from '@angular/common';
import { InterfaceService } from './services/interface.service';

@Component({
  selector: 'app-root',
  imports: [Main, Aside, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public interfaceService = inject(InterfaceService);
  protected title = 'front-end';
}
