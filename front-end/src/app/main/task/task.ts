import { AsyncPipe, CommonModule } from "@angular/common";
import { Component, inject, signal, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { delay, Subject, takeUntil } from "rxjs";
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
export class TaskComponent implements OnInit, OnDestroy {
  private authStateService = inject(AuthStateService);
  private iconRegistryService = inject(IconRegistryService);
  private interfaceService = inject(InterfaceService);
  private relojService = inject(RelojService);
  private taskService = inject(TaskService);
  private listService = inject(ListService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  addIcon = this.iconRegistryService.getIcon('add');
  sendIcon = this.iconRegistryService.getIcon('send');
  calendarIcon = this.iconRegistryService.getIcon('calendar_clean');

  arrowDownwardsIcon = this.iconRegistryService.getIcon('arrow_downwards');
  arrowUpwardsIcon = this.iconRegistryService.getIcon('arrow_upwards');
  lineIcon = this.iconRegistryService.getIcon('line');

  clockIcon = this.iconRegistryService.getIcon('clock');
  flagIcon = this.iconRegistryService.getIcon('flag');

  filter = signal<'hour' | 'priority' | null>(null);
  ascHour = signal<boolean>(false);
  ascPriority = signal<boolean>(false);

  constructor() { }

  ngOnInit() {
    this.taskService.getTasks().subscribe();
    this.relojService.getFechaHora().subscribe();

    // Suscribirse a los cambios en los query params hasta que el componente se destruya
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        // Leer el filtro de los query params
        const filterType = params['filter'] as 'hour' | 'priority' | null;
        const ascending = params['asc'] === 'true';

        if (filterType === 'hour') {
          this.filter.set('hour');
          this.ascHour.set(ascending);
        } else if (filterType === 'priority') {
          this.filter.set('priority');
          this.ascPriority.set(ascending);
        } else {
          this.cleanFilters();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.taskService.updateTask(task.id, payload).subscribe({
      next: (updatedTask) => {
        this.interfaceService.setEventActive(true);
        this.interfaceService.setEvent('TASK COMPLETED', `Task "${updatedTask.name}" has been marked as completed.`);
      }
    });
  }

  formatTimeTo12Hour(time24: string): string {
    if (!time24) return '';

    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

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
    this.interfaceService.selectedTask.set(task);
    this.interfaceService.setShowingDetailsTask(true);
    this.interfaceService.setEditActiveTask(true);
    this.interfaceService.setCurrentOperation('Add Task');
    this.interfaceService.togglePopUp();
  }

  filterByHour() {
    if (this.filter() === 'hour') {
      const newAsc = !this.ascHour();
      this.ascHour.set(newAsc);
      this.updateQueryParams('hour', newAsc);
      return;
    }

    // Activar filtro por primera vez
    this.cleanFilters();
    this.ascHour.set(true);
    this.filter.set('hour');
    this.updateQueryParams('hour', true);
  }

  filterByPriority() {
    if (this.filter() === 'priority') {
      const newAsc = !this.ascPriority();
      this.ascPriority.set(newAsc);
      this.updateQueryParams('priority', newAsc);
      return;
    }

    // Activar filtro por primera vez
    this.cleanFilters();
    this.ascPriority.set(true);
    this.filter.set('priority');
    this.updateQueryParams('priority', true);
  }

  private updateQueryParams(filterType: 'hour' | 'priority', ascending: boolean) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        filter: filterType,
        asc: ascending
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
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

    tasks = tasks.filter(t => !t.completed);

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

    if (this.selectedListId) {
      tasks = tasks.filter(t => t.listId === this.selectedListId);
    }

    if (this.filter() === 'hour') {
      tasks = tasks.sort((a, b) => {
        const dateTimeA = new Date(`${a.dueDate}T${a.dueTime || '23:59'}`);
        const dateTimeB = new Date(`${b.dueDate}T${b.dueTime || '23:59'}`);

        return this.ascHour()
          ? dateTimeA.getTime() - dateTimeB.getTime()
          : dateTimeB.getTime() - dateTimeA.getTime();
      });
    } else if (this.filter() === 'priority') {
      const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };

      tasks = tasks.sort((a, b) => {
        const priorityA = priorityOrder[a.priority as unknown as keyof typeof priorityOrder] || 2;
        const priorityB = priorityOrder[b.priority as unknown as keyof typeof priorityOrder] || 2;

        return this.ascPriority()
          ? priorityA - priorityB
          : priorityB - priorityA;
      });
    }

    return tasks;
  }

  get cantTasks() {
    return this.tasks.length;
  }

  get username() {
    return this.authStateService.user()?.username;
  }

  get selectedListId() {
    return this.interfaceService.selectedList()?.id;
  }

  get iconHour() {
    if (this.filter() !== 'hour') return this.lineIcon;
    return this.ascHour() ? this.arrowUpwardsIcon : this.arrowDownwardsIcon;
  }

  get iconPriority() {
    if (this.filter() !== 'priority') return this.lineIcon;
    return this.ascPriority() ? this.arrowUpwardsIcon : this.arrowDownwardsIcon;
  }
}