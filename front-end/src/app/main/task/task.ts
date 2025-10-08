import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
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
  imports: [IconTextButton, AsyncPipe, CommonModule],
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
  arrowUpwardsIcon = this.iconRegistryService.getIcon('arrow_upwards');

  clockIcon = this.iconRegistryService.getIcon('clock');
  flagIcon = this.iconRegistryService.getIcon('flag');

  filter = signal<'hour' | 'priority' | null>(null);
  ascHour = signal<boolean>(false);
  ascPriority = signal<boolean>(false);

  constructor() {
    this.taskService.getTasks().subscribe();
  }

  togglePopUp() {
    if (this.interfaceService.isPopUpOpen() == false) {
      this.interfaceService.togglePopUp();
    }

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

  getPriorityColor(priority: Priority): string {
    const priorityString = priority.toString();

    switch (priorityString) {
      case 'HIGH':
        return 'var(--high)';
      case 'MEDIUM':
        return 'var(--medium)';
      case 'LOW':
        return 'var(--low)';
      default:
        return 'var(--purple)';
    }
  }

  openTaskDetails(task: Task) {
    if (!task.id) return;
    this.interfaceService.setShowingDetailsTask(true);
    this.interfaceService.setCurrentOperation('Add Task');
    this.interfaceService.togglePopUp();
    this.interfaceService.selectedTaskId.set(task.id || null);
  }

  filterByHour() {
    if (this.filter() === 'hour') {
      this.ascHour.set(!this.ascHour());
      return;
    }

    this.cleanFilters();
    this.ascHour.set(!this.ascHour());
    this.filter.set('hour');
  }

  filterByPriority() {
    if (this.filter() === 'priority') {
      this.ascPriority.set(!this.ascPriority());
      return;
    }

    this.cleanFilters();
    this.ascPriority.set(!this.ascPriority());
    this.filter.set('priority');
  }

  private cleanFilters() {
    this.filter.set(null);
    this.ascHour.set(false);
    this.ascPriority.set(false);
  }

  get title() {
    return this.iconRegistryService.getMenu()[this.interfaceService.selectedMenuId() - 1].name;
  }

  get dateAndTime() {
    return this.relojService.getFechaHora();
  }

  get tasks() {
    let tasks = this.taskService.tasks$();
    const selectedMenu = this.interfaceService.selectedMenuId();
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Filtrar solo tareas no completadas
    tasks = tasks.filter(t => !t.completed);

    // Filtrar por menú (Today o Upcoming)
    if (selectedMenu === 1) {
      tasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        return taskDate.getTime() <= now.getTime();
      });
    } else if (selectedMenu === 2) {
      tasks = tasks.filter(t => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        return taskDate.getTime() > now.getTime();
      });
    }

    // Filtrar por lista seleccionada
    if (this.selectedListId) {
      tasks = tasks.filter(t => t.listId === this.selectedListId);
    }

    // Ordenar según el filtro seleccionado
    if (this.filter() === 'hour') {
      tasks = tasks.sort((a, b) => {
        // Combinar fecha y hora para comparación completa
        const dateTimeA = new Date(`${a.dueDate}T${a.dueTime || '23:59'}`);
        const dateTimeB = new Date(`${b.dueDate}T${b.dueTime || '23:59'}`);

        return this.ascHour()
          ? dateTimeA.getTime() - dateTimeB.getTime()  // Ascendente: más temprano primero
          : dateTimeB.getTime() - dateTimeA.getTime(); // Descendente: más tarde primero
      });
    } else if (this.filter() === 'priority') {
      const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };

      tasks = tasks.sort((a, b) => {
        const priorityA = priorityOrder[a.priority as unknown as keyof typeof priorityOrder] || 2;
        const priorityB = priorityOrder[b.priority as unknown as keyof typeof priorityOrder] || 2;

        return this.ascPriority()
          ? priorityA - priorityB  // Ascendente: LOW -> MEDIUM -> HIGH
          : priorityB - priorityA; // Descendente: HIGH -> MEDIUM -> LOW
      });
    }

    return tasks;
  }


  get username() {
    return this.authStateService.user()?.username;
  }

  get selectedListId() {
    return this.interfaceService.selectedListId();
  }
}