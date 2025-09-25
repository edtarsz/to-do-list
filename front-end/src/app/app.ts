import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Main } from './main/main';
import { Aside } from './aside/aside';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Main, Aside],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'front-end';
}
