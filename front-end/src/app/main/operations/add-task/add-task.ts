import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconTextButton } from '../../../global-components/icon-text-button/icon-text-button';
import { IconRegistryService } from '../../../global-services/icon-registry.service';
import { InterfaceService } from '../../../global-services/interface.service';
import { TaskService } from '../../../global-services/tasks.service';
import { ListService } from '../../../global-services/lists.service';
import { AsideItem } from "../../aside/aside-item/aside-item";
import { Priority, Task } from '../../../models/task';

@Component({
  selector: 'app-add-task',
  imports: [IconTextButton, CommonModule, ReactiveFormsModule, AsideItem],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'
})
export class AddTask {
  public interfaceService = inject(InterfaceService);
  public iconRegistryService = inject(IconRegistryService);
  public taskService = inject(TaskService);
  public listService = inject(ListService);

  private fb = inject(FormBuilder);

  addTaskForm!: FormGroup;

  showList = false;
  showPriority = false;
  showStartTime = false;
  showDueTime = false;
  showStartDate = false;
  showDueDate = false;

  selectedList = signal<string>('List');
  selectedPriority = signal<string>('Priority');
  selectedStartTime = signal<string>('Start Time');
  selectedDueTime = signal<string>('Due Time');
  selectedStartDate = signal<string>('Start Date');
  selectedDueDate = signal<string>('Due Date');

  openDropdown = signal<null | 'list' | 'priority' | 'startTime' | 'dueTime' | 'startDate' | 'dueDate'>(null);

  prioritys = [
    { name: Priority[Priority.LOW], color: 'var(--low)', value: Priority.LOW },
    { name: Priority[Priority.MEDIUM], color: 'var(--medium)', value: Priority.MEDIUM },
    { name: Priority[Priority.HIGH], color: 'var(--high)', value: Priority.HIGH }
  ];

  constructor() {
    this.addTaskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      description: [''],
      priority: [''],
      startDate: [''],
      dueDate: [''],
      startTime: [''],
      dueTime: [''],
      listId: [''],
      completed: [false]
    });
  }

  closeIcon = this.iconRegistryService.getIcon('close');
  sendIcon = this.iconRegistryService.getIcon('send');
  clockIcon = this.iconRegistryService.getIcon('clock');
  calendarCleanIcon = this.iconRegistryService.getIcon('calendar_clean');
  arrowListIcon = this.iconRegistryService.getIcon('arrow_list');
  flagIcon = this.iconRegistryService.getIcon('flag');

  togglePopUp() {
    this.interfaceService.togglePopUp();
  }

  addTask() {
    if (this.addTaskForm.valid) {
      this.taskService.addTask(this.buildTask()).subscribe({
        next: () => {
          this.addTaskForm.reset();
          this.resetSelections();
          this.togglePopUp();
        },
        error: (error) => {
          console.error(error);
        }
      });
    } else {
      console.error('Please fill in all required fields.');
    }
  }

  private getLocalDateString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  buildTask(): Task {
    const formValue = this.addTaskForm.value;

    return {
      name: formValue.name,
      description: formValue.description || '',
      priority: formValue.priority || Priority[Priority.MEDIUM],
      startDate: formValue.startDate || this.getLocalDateString(),
      dueDate: formValue.dueDate || this.getLocalDateString(),
      startTime: formValue.startTime || "00:00",
      dueTime: formValue.dueTime || "23:59",
      completed: false,
      listId: formValue.listId || null
    }
  }

  toggleDropdown(type: 'list' | 'priority' | 'startTime' | 'dueTime' | 'startDate' | 'dueDate') {
    this.openDropdown.set(this.openDropdown() === type ? null : type);
  }

  selectList(listId: number) {
    this.addTaskForm.patchValue({ listId: listId });
    this.selectedList.set(this.lists.find(list => list.id === listId)?.name || 'List');
    this.openDropdown.set(null);
  }

  selectPriority(priority: string) {
    this.addTaskForm.patchValue({ priority: priority });
    this.selectedPriority.set(priority);
    this.openDropdown.set(null);
  }

  onStartTimeChange(event: any) {
    const time = event.target.value;
    this.addTaskForm.patchValue({ startTime: time });
    this.selectedStartTime.set(time);
    this.openDropdown.set(null);
  }

  onDueTimeChange(event: any) {
    const time = event.target.value;
    this.addTaskForm.patchValue({ dueTime: time });
    this.selectedDueTime.set(time);
    this.openDropdown.set(null);
  }

  onStartDateChange(event: any) {
    const date = event.target.value;
    this.addTaskForm.patchValue({ startDate: date });
    this.selectedStartDate.set(date);
    this.openDropdown.set(null);
  }

  onDueDateChange(event: any) {
    const date = event.target.value;
    this.addTaskForm.patchValue({ dueDate: date });
    this.selectedDueDate.set(date);
    this.openDropdown.set(null);
  }

  private resetSelections() {
    this.selectedList.set('List');
    this.selectedPriority.set('Priority');
    this.selectedStartTime.set('Start Time');
    this.selectedDueTime.set('Due Time');
    this.selectedStartDate.set('Start Date');
    this.selectedDueDate.set('Due Date');
  }

  get lists() {
    return this.listService.lists();
  }
}