import { Component, inject } from "@angular/core";
import { AuthStateService } from "../../global-services/auth-state.service";
import { IconRegistryService } from "../../global-services/icon-registry.service";
import { InterfaceService } from "../../global-services/interface.service";
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { RelojService } from "../../global-services/reloj-service";
import { AsyncPipe } from "@angular/common";
import { TaskService } from "../../global-services/tasks.service";
import { List } from "../../models/list";
import { ListService } from "../../global-services/lists.service";
import { Task } from "../../models/task";

@Component({
  selector: 'app-task',
  imports: [IconTextButton, AsyncPipe],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class TaskComponent {
  private authStateService = inject(AuthStateService);
  private iconRegistryService = inject(IconRegistryService);
  private interfaceService = inject(InterfaceService);
  private relojService = inject(RelojService);
  private taskService = inject(TaskService);
  private listService = inject(ListService);

  addIcon = this.iconRegistryService.getIcon('add');
  sendIcon = this.iconRegistryService.getIcon('send');
  arrowDownwardsIcon = this.iconRegistryService.getIcon('arrow_downwards');

  constructor() {
    this.taskService.getTasks().subscribe();
  }

  togglePopUp() {
    this.interfaceService.setCurrentOperation('Add Task');
  }

  getListById(id: number | undefined): List | undefined {
    if (!id) return undefined;
    return this.listService.lists$().find(list => list.id === id);
  }

  completeTask(task: Task) {
    if (!task.id) return;
    const payload = { completed: true };
    this.taskService.updateTask(task.id, payload).subscribe();
  }

  get title() {
    return this.iconRegistryService.getMenu()[this.interfaceService.selectedMenuId() - 1].name;
  }

  get dateAndTime() {
    return this.relojService.getFechaHora();
  }

  get tasks() {
    return this.taskService.tasks$();
  }

  get username() {
    return this.authStateService.user()?.username;
  }

}