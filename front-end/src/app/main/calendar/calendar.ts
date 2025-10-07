import { Component, inject, OnInit } from '@angular/core';
import { IconTextButton } from "../../global-components/icon-text-button/icon-text-button";
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../global-services/tasks.service';
import { Task } from '../../models/task';
import { ListService } from '../../global-services/lists.service';

@Component({
  selector: 'app-calendar',
  imports: [IconTextButton, CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css'
})
export class Calendar implements OnInit {
  iconRegistryService = inject(IconRegistryService);
  private taskService = inject(TaskService);
  private listService = inject(ListService);

  arrowBackIcon = this.iconRegistryService.getIcon('arrow_downwards');
  arrowNextIcon = this.iconRegistryService.getIcon('arrow_list');

  currentDate = new Date();
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
    const weekNames = ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta'];
    const monthWeek = Math.ceil(date.getDate() / 7);
    return `${weekNames[monthWeek - 1] || monthWeek + 'a'} Semana`;
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

  isAllDayTask(task: Task): boolean {
    const startMinutes = this.getMinutesFromTime(task.startTime);
    const endMinutes = this.getMinutesFromTime(task.dueTime);
    const durationMinutes = endMinutes - startMinutes;
    const durationHours = durationMinutes / 60;

    const taskStartDate = new Date(task.startDate);
    const taskDueDate = new Date(task.dueDate);
    const isMultiDay = taskStartDate.getDate() !== taskDueDate.getDate() ||
      taskStartDate.getMonth() !== taskDueDate.getMonth() ||
      taskStartDate.getFullYear() !== taskDueDate.getFullYear();

    return isMultiDay || durationHours >= 12 ||
      (task.startTime === "00:00" && task.dueTime === "23:59");
  }

  getTaskGroups(dayInfo: { name: string; date: number; fullDate: Date }): Task[][] {
    const tasks = this.getTasksForDay(dayInfo);
    if (tasks.length === 0) return [];

    const allDayTasks = tasks.filter(task => this.isAllDayTask(task));
    const timedTasks = tasks.filter(task => !this.isAllDayTask(task));

    const groups: Task[][] = [];

    if (allDayTasks.length > 0) {
      groups.push(allDayTasks);
    }

    if (timedTasks.length > 0) {
      const sortedTasks = [...timedTasks].sort((a, b) => {
        const timeA = this.getMinutesFromTime(a.startTime);
        const timeB = this.getMinutesFromTime(b.startTime);
        return timeA - timeB;
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
    }

    return groups;
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
    if (tasks.length > 0 && this.isAllDayTask(tasks[0])) {
      return "00:00";
    }

    const times = tasks.map(t => this.getMinutesFromTime(t.startTime));
    const minTime = Math.min(...times);
    const hours = Math.floor(minTime / 60);
    const minutes = minTime % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  getGroupEndTime(tasks: Task[]): string {
    if (tasks.length > 0 && this.isAllDayTask(tasks[0])) {
      const minHeight = Math.max(1, tasks.length * 0.5);
      return `${minHeight.toString().padStart(2, '0')}:00`;
    }

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

  getListColor(task: Task): string {
    let color = '#60A5FA';

    if (task.listId) {
      this.listService.getListById(task.listId).subscribe(list => {
        color = list.color;
      });
    }

    return color;
  }

  getTaskLeftPosition(task: Task, dayInfo: { name: string; date: number; fullDate: Date }): string {
    const taskStartDate = new Date(task.startDate);
    const dayDate = dayInfo.fullDate;

    const normalizedTaskStart = new Date(taskStartDate.getFullYear(), taskStartDate.getMonth(), taskStartDate.getDate());
    const normalizedDay = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());

    if (normalizedDay.getTime() === normalizedTaskStart.getTime()) {
      return '5%';
    }

    return '0%';
  }

  getTaskRightPosition(task: Task, dayInfo: { name: string; date: number; fullDate: Date }): string {
    const taskDueDate = new Date(task.dueDate);
    const dayDate = dayInfo.fullDate;

    const normalizedTaskDue = new Date(taskDueDate.getFullYear(), taskDueDate.getMonth(), taskDueDate.getDate());
    const normalizedDay = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());

    if (normalizedDay.getTime() === normalizedTaskDue.getTime()) {
      return '5%';
    }

    return '0%';
  }

  getPriorityColor(priority: number): string {
    switch (priority) {
      case 0: return 'bg-green-400';
      case 1: return 'bg-yellow-400';
      case 2: return 'bg-red-400';
      default: return 'bg-blue-400';
    }
  }
}