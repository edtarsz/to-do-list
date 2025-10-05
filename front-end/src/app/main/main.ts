import { Component, inject } from '@angular/core';
import { Aside } from "./aside/aside";
import { InterfaceService } from '../global-services/interface.service';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AddTask } from "./operations/add-task/add-task";
import { AddList } from "./operations/add-list/add-list";
import { PopUp } from '../global-components/pop-up/pop-up';

@Component({
  selector: 'app-main',
  imports: [Aside, CommonModule, RouterOutlet, PopUp, AddTask, AddList],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class Main {
  public interfaceService = inject(InterfaceService);

  get currentOperation() {
    return this.interfaceService.currentOperation();
  }

  get isPopUpOpen() {
    return this.interfaceService.isPopUpOpen();
  }
}
