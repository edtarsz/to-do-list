import { Component, inject } from '@angular/core';
import { Main } from './main/main';
import { Aside } from './main/aside/aside';
import { CommonModule } from '@angular/common';
import { InterfaceService } from './services/interface.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'front-end';
}
