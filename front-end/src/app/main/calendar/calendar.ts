import { Component, inject, OnInit } from '@angular/core';
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../global-services/tasks.service';
import { Task } from '../../models/task';
import { ListService } from '../../global-services/lists.service';
import { InterfaceService } from '../../global-services/interface.service';

@Component({
  selector: 'app-calendar',
  imports: [IconTextButton, CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar implements OnInit {
  iconRegistryService = inject(IconRegistryService);
  private interfaceService = inject(InterfaceService);
  private taskService = inject(TaskService);
  private listService = inject(ListService);

  arrowBackIcon = this.iconRegistryService.getIcon('arrow_downwards');
  arrowNextIcon = this.iconRegistryService.getIcon('arrow_list');

  currentWeekOffset = 0;
  weekDays: { name: string; date: number; fullDate: Date }[] = [];
  currentMonth = '';
  currentYear = 0;
  weekNumber = '';

  hours = [
    '0 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM',
    '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
    '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'
  ];

  constructor() {
    this.taskService.getTasks().subscribe();
  }

  ngOnInit() {
    this.updateWeekDays();
  }

  updateWeekDays() {
    const today = new Date();
    const baseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    baseDate.setDate(baseDate.getDate() + (this.currentWeekOffset * 7));

    const dayOfWeek = baseDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + diff);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);

      this.weekDays.push({
        name: dayNames[day.getDay()],
        date: day.getDate(),
        fullDate: new Date(day.getFullYear(), day.getMonth(), day.getDate())
      });
    }

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.currentMonth = months[monday.getMonth()];
    this.currentYear = monday.getFullYear();

    this.weekNumber = this.getWeekNumber(monday);
  }

  getWeekNumber(date: Date): string {
    const weekNames = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    const monthWeek = Math.ceil(date.getDate() / 7);
    return `${weekNames[monthWeek - 1] || monthWeek + 'a'} Week`;
  }

  previousWeek() {
    this.currentWeekOffset--;
    this.updateWeekDays();
  }

  nextWeek() {
    this.currentWeekOffset++;
    this.updateWeekDays();
  }

  get tasks() {
    return this.taskService.tasks$();
  }

  getTasksForDay(dayInfo: { name: string; date: number; fullDate: Date }): Task[] {
    return this.tasks.filter(task => {
      if (task.completed) return false;

      const taskStartDate = new Date(task.startDate);
      const taskDueDate = new Date(task.dueDate);
      const dayDate = dayInfo.fullDate;

      const normalizedTaskStart = new Date(taskStartDate.getFullYear(), taskStartDate.getMonth(), taskStartDate.getDate());
      const normalizedTaskDue = new Date(taskDueDate.getFullYear(), taskDueDate.getMonth(), taskDueDate.getDate());
      const normalizedDay = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());

      return normalizedDay >= normalizedTaskStart && normalizedDay <= normalizedTaskDue;
    });
  }

  getTaskGroups(dayInfo: { name: string; date: number; fullDate: Date }): Task[][] {
    const tasks = this.getTasksForDay(dayInfo);
    if (tasks.length === 0) return [];

    // Filtrar solo las tareas que NO son all-day
    const timedTasks = tasks.filter(task => task.startTime !== "00:00" || task.dueTime !== "23:59");

    if (timedTasks.length === 0) return [];

    const groups: Task[][] = [];
    const sortedTasks = [...timedTasks].sort((a, b) => {
      return this.getMinutesFromTime(a.startTime) - this.getMinutesFromTime(b.startTime);
    });

    let currentGroup: Task[] = [sortedTasks[0]];

    for (let i = 1; i < sortedTasks.length; i++) {
      const currentTask = sortedTasks[i];
      const overlaps = currentGroup.some(groupTask => this.tasksOverlap(groupTask, currentTask));

      if (overlaps) {
        currentGroup.push(currentTask);
      } else {
        groups.push(currentGroup);
        currentGroup = [currentTask];
      }
    }
    groups.push(currentGroup);

    return groups;
  }

  getTaskDateRange(task: Task): string {
    const start = new Date(task.startDate);
    const end = new Date(task.dueDate);

    if (task.startDate === task.dueDate) {
      const month = start.toLocaleDateString('en-US', { month: 'short' });
      return `${month} ${start.getDate()}`;
    }

    const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-US', { month: 'short' });

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`;
    }

    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}`;
  }

  tasksOverlap(task1: Task, task2: Task): boolean {
    const start1 = this.getMinutesFromTime(task1.startTime);
    const end1 = this.getMinutesFromTime(task1.dueTime);
    const start2 = this.getMinutesFromTime(task2.startTime);
    const end2 = this.getMinutesFromTime(task2.dueTime);

    return start1 < end2 && start2 < end1;
  }

  getMinutesFromTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getGroupStartTime(tasks: Task[]): string {
    const times = tasks.map(t => this.getMinutesFromTime(t.startTime));
    const minTime = Math.min(...times);
    const hours = Math.floor(minTime / 60);
    const minutes = minTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  getGroupEndTime(tasks: Task[]): string {
    const times = tasks.map(t => this.getMinutesFromTime(t.dueTime));
    const maxTime = Math.max(...times);
    const hours = Math.floor(maxTime / 60);
    const minutes = maxTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  getTaskTopPosition(startTime: string): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalHours = hours + (minutes / 60);
    const vh = totalHours * 10;
    return `calc(${vh}vh + 1.25rem)`;
  }

  getTaskHeight(startTime: string, dueTime: string): string {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [dueHours, dueMinutes] = dueTime.split(':').map(Number);

    const startTotalHours = startHours + (startMinutes / 60);
    const dueTotalHours = dueHours + (dueMinutes / 60);

    const durationHours = dueTotalHours - startTotalHours;
    const vh = Math.max(durationHours * 10, 3);

    return `${vh}vh`;
  }

  getTaskColor(task: Task): string {
    if (task.listId) {
      const list = this.listService.lists().find(l => l.id === task.listId);
      if (list) return list.color;
    }

    // Color según prioridad
    const colors = {
      0: '#10b981', // LOW - verde
      1: '#f59e0b', // MEDIUM - amarillo
      2: '#ef4444'  // HIGH - rojo
    };
    return colors[task.priority as keyof typeof colors] || '#6b7280';
  }

  getMultiDayTasks(): Task[] {
    const weekStart = this.weekDays[0].fullDate;
    const weekEnd = this.weekDays[6].fullDate;

    return this.tasks.filter(task => {
      if (task.completed) return false;

      const isAllDay = task.startTime === "00:00" && task.dueTime === "23:59";
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.dueDate);
      const isInWeek = taskStart <= weekEnd && taskEnd >= weekStart;

      return isAllDay && isInWeek;
    });
  }

  getMultiDayTaskLayers(): Task[][] {
    const allDayTasks = this.getMultiDayTasks();
    if (allDayTasks.length === 0) return [];

    const sortedTasks = [...allDayTasks].sort((a, b) => {
      const startCompare = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      if (startCompare !== 0) return startCompare;

      const durationA = new Date(a.dueDate).getTime() - new Date(a.startDate).getTime();
      const durationB = new Date(b.dueDate).getTime() - new Date(b.startDate).getTime();
      return durationB - durationA;
    });

    const layers: Task[][] = [];

    sortedTasks.forEach(task => {
      let placed = false;
      const taskSpan = this.getTaskSpan(task);

      for (let layer of layers) {
        let hasOverlap = false;

        for (let existingTask of layer) {
          const existingSpan = this.getTaskSpan(existingTask);

          const task1Start = taskSpan.startIndex;
          const task1End = taskSpan.startIndex + taskSpan.span;
          const task2Start = existingSpan.startIndex;
          const task2End = existingSpan.startIndex + existingSpan.span;

          if (task1Start < task2End && task2Start < task1End) {
            hasOverlap = true;
            break;
          }
        }

        if (!hasOverlap) {
          layer.push(task);
          placed = true;
          break;
        }
      }

      if (!placed) {
        layers.push([task]);
      }
    });

    return layers;
  }

  getTaskSpan(task: Task): { startIndex: number, span: number } {
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.dueDate);

    taskStart.setHours(0, 0, 0, 0);
    taskEnd.setHours(0, 0, 0, 0);

    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < this.weekDays.length; i++) {
      const dayDate = new Date(this.weekDays[i].fullDate);
      dayDate.setHours(0, 0, 0, 0);

      if (dayDate.getTime() >= taskStart.getTime()) {
        startIndex = i;
        break;
      }
    }

    if (startIndex === -1) startIndex = 0;

    for (let i = this.weekDays.length - 1; i >= 0; i--) {
      const dayDate = new Date(this.weekDays[i].fullDate);
      dayDate.setHours(0, 0, 0, 0);

      if (dayDate.getTime() <= taskEnd.getTime()) {
        endIndex = i + 1;
        break;
      }
    }

    if (endIndex === -1) endIndex = this.weekDays.length;
    if (startIndex === -1 || endIndex === -1) return { startIndex: 0, span: 0 };

    const span = endIndex - startIndex;
    return { startIndex, span: Math.max(span, 1) };
  }

  openTaskDetails(task: Task) {
    this.interfaceService.setCurrentOperation('Add Task');
    this.interfaceService.selectedTask.set(task);
    this.interfaceService.setEditActiveTask(true);
    this.interfaceService.togglePopUp();
  }
}