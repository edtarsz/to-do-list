import { AsyncPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { AuthStateService } from "../../global-services/auth-state.service";
import { IconRegistryService } from "../../global-services/icon-registry.service";
import { InterfaceService } from "../../global-services/interface.service";
import { ListService } from "../../global-services/lists.service";
import { RelojService } from "../../global-services/reloj-service";
import { TaskService } from "../../global-services/tasks.service";
import { List } from "../../models/list";
import { Priority, Task } from "../../models/task";

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
  calendarIcon = this.iconRegistryService.getIcon('calendar_clean');
  arrowDownwardsIcon = this.iconRegistryService.getIcon('arrow_downwards');

  constructor() {
    this.taskService.getTasks().subscribe();
  }

  togglePopUp() {
    this.interfaceService.selectedTaskId.set(null);
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

  formatTimeTo12Hour(time24: string): string {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // 0 a 12, and 13-23 to 1-11

    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';

    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    if (compareDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (compareDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  }

  getPriorityText(priority: string | Priority | undefined): string {
    if (priority === undefined || priority === null) return 'Medium';

    const priorityStr = String(priority);

    if (!isNaN(Number(priorityStr))) {
      return Priority[Number(priorityStr)];
    }

    return priorityStr.charAt(0).toUpperCase() + priorityStr.slice(1).toLowerCase();
  }

  openTaskDetails(task: Task) {
    if (!task.id) return;
    this.interfaceService.setShowingDetailsTask(true);
    this.interfaceService.setCurrentOperation('Add Task');
    this.interfaceService.selectedTaskId.set(task.id || null);
  }

  get title() {
    return this.iconRegistryService.getMenu()[this.interfaceService.selectedMenuId() - 1].name;
  }

  get dateAndTime() {
    return this.relojService.getFechaHora();
  }

  get tasks() {
    if (this.selectedListId) {
      return this.taskService.tasks$().filter(t => t.listId === this.selectedListId && !t.completed);
    }

    return this.taskService.tasks$().filter(t => !t.completed);
  }

  get username() {
    return this.authStateService.user()?.username;
  }

  get selectedListId() {
    return this.interfaceService.selectedListId();
  }
}