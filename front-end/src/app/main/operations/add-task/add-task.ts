import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { IconTextButton } from '../../../global-components/icon-text-button/icon-text-button';
import { IconRegistryService } from '../../../global-services/icon-registry.service';
import { InterfaceService } from '../../../global-services/interface.service';
import { TaskService } from '../../../global-services/tasks.service';
import { ListService } from '../../../global-services/lists.service';
import { AsideItem } from '../../aside/aside-item/aside-item';
import { Priority, Task } from '../../../models/task';

@Component({
  selector: 'app-add-task',
  imports: [IconTextButton, CommonModule, ReactiveFormsModule, AsideItem],
  templateUrl: './add-task.html',
  styleUrls: ['./add-task.css']
})
export class AddTask {
  private interfaceService = inject(InterfaceService);
  private iconRegistryService = inject(IconRegistryService);
  private taskService = inject(TaskService);
  private listService = inject(ListService);
  private fb = inject(FormBuilder);

  addTaskForm!: FormGroup;
  errorMessage = '';
  isSubmitting = false;

  showList = false;
  showPriority = false;
  showStartTime = false;
  showDueTime = false;
  showStartDate = false;
  showDueDate = false;

  selectedList = signal<string>('List');
  selectedPriority = signal<string>('Priority');
  selectedStartTime = signal<string>('Start');
  selectedDueTime = signal<string>('Due');
  selectedStartDate = signal<string>('Start');
  selectedDueDate = signal<string>('Due');

  openDropdown = signal<null | 'list' | 'priority' | 'startTime' | 'dueTime' | 'startDate' | 'dueDate'>(null);

  prioritys = [
    { name: Priority[Priority.LOW], color: 'var(--low)', value: Priority.LOW },
    { name: Priority[Priority.MEDIUM], color: 'var(--medium)', value: Priority.MEDIUM },
    { name: Priority[Priority.HIGH], color: 'var(--high)', value: Priority.HIGH }
  ];

  constructor() {
    this.setupForm();
    this.prefillFormIfEditing();
  }

  private setupForm(): void {
    this.addTaskForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255)
      ]],
      description: ['', [Validators.maxLength(500)]],
      priority: [''],
      startDate: [''],
      dueDate: [''],
      startTime: [''],
      dueTime: [''],
      listId: [''],
      completed: [false]
    }, { validators: AddTask.dateTimeRangeValidator });
  }

  private prefillFormIfEditing(): void {
    const task = this.interfaceService.selectedTask();
    if (task && this.interfaceService.editActiveTask()) {
      this.addTaskForm.patchValue({
        name: task.name,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        dueDate: task.dueDate,
        startTime: task.startTime,
        dueTime: task.dueTime,
        listId: task.listId,
        completed: task.completed
      });

      this.selectedList.set(this.listService.lists().find(list => list.id === task.listId)?.name || 'List');
      this.selectedPriority.set(task.priority.toString() || 'Priority');
      this.selectedStartTime.set(task.startTime || 'Start');
      this.selectedDueTime.set(task.dueTime || 'Due');
      this.selectedStartDate.set(task.startDate || 'Start');
      this.selectedDueDate.set(task.dueDate || 'Due');
    }
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
    this.errorMessage = '';

    if (this.addTaskForm.invalid) {
      this.addTaskForm.markAllAsTouched();
      this.errorMessage = this.addTaskForm.hasError('datetimeRange')
        ? 'Start date and time must be before due date and time.'
        : 'Please fill in all required fields correctly.';
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const taskData = this.buildTask();

    if (this.interfaceService.selectedTask()) {
      const id = this.interfaceService.selectedTask()?.id;
      if (!id) return;

      this.taskService.updateTask(id, taskData).subscribe({
        next: (task) => {
          this.isSubmitting = false;
          this.interfaceService.selectedTask.set(null);
          this.event(task, 'TASK UPDATED', 'updated');
          this.resetForm();
          this.togglePopUp();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'An error occurred while updating the task.';
        }
      });
    } else {
      this.taskService.addTask(taskData).subscribe({
        next: (task) => {
          this.isSubmitting = false;
          this.event(task, 'TASK', 'created');
          this.resetForm();
          this.togglePopUp();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'An error occurred while creating the task.';
        }
      });
    }
  }

  static dateTimeRangeValidator: ValidatorFn = (control) => {
    if (!(control instanceof FormGroup)) return null;
    const startDate = control.get('startDate')?.value;
    const dueDate = control.get('dueDate')?.value;
    const startTime = control.get('startTime')?.value;
    const dueTime = control.get('dueTime')?.value;

    if (!startDate && !dueDate && !startTime && !dueTime) return null;

    const startDateTime = new Date(`${startDate || '2000-01-01'}T${startTime || '00:00'}`);
    const dueDateTime = new Date(`${dueDate || '2000-01-01'}T${dueTime || '23:59'}`);

    if (startDateTime >= dueDateTime) return { datetimeRange: true };

    return null;
  };

  clearValidationErrors() {
    this.errorMessage = '';
    this.addTaskForm.updateValueAndValidity();
  }

  private resetForm() {
    this.addTaskForm.reset();
    this.resetSelections();
    this.errorMessage = '';
    this.clearValidationErrors();
  }

  private event(task: Task, title: string, message: string) {
    this.interfaceService.setEventActive(true);
    this.interfaceService.setEvent(`${title}`, `Task ${task.name} has been successfully ${message}.`);
  }

  private getLocalDateString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  buildTask(): Task {
    const formValue = this.addTaskForm.value;
    const today = this.getLocalDateString();

    let startDate = formValue.startDate || today;
    let dueDate = formValue.dueDate || today;

    let priority = formValue.priority;
    if (priority === '' || priority === null || priority === undefined) {
      priority = 'MEDIUM';
    } else if (typeof priority === 'number') {
      priority = Priority[priority];
    }

    return {
      name: formValue.name,
      description: formValue.description || '',
      priority: priority,
      startDate: startDate,
      dueDate: dueDate,
      startTime: formValue.startTime || '00:00',
      dueTime: formValue.dueTime || '23:59',
      completed: false,
      listId: formValue.listId || null
    };
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
    this.clearValidationErrors();
    this.openDropdown.set(null);
  }

  onDueTimeChange(event: any) {
    const time = event.target.value;
    this.addTaskForm.patchValue({ dueTime: time });
    this.selectedDueTime.set(time);
    this.clearValidationErrors();
    this.openDropdown.set(null);
  }

  onStartDateChange(event: any) {
    const date = event.target.value;
    this.addTaskForm.patchValue({ startDate: date });
    this.selectedStartDate.set(date);
    this.clearValidationErrors();
    this.openDropdown.set(null);
  }

  onDueDateChange(event: any) {
    const date = event.target.value;
    this.addTaskForm.patchValue({ dueDate: date });
    this.selectedDueDate.set(date);
    this.clearValidationErrors();
    this.openDropdown.set(null);
  }

  private resetSelections() {
    this.selectedList.set('List');
    this.selectedPriority.set('Priority');
    this.selectedStartTime.set('Start');
    this.selectedDueTime.set('Due');
    this.selectedStartDate.set('Start');
    this.selectedDueDate.set('Due');
  }

  getErrorMessage(controlName: string): string {
    const control = this.addTaskForm.get(controlName);
    if (!control || !control.touched || !control.errors) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength')) return `Must be at least ${control.getError('minlength').requiredLength} characters`;
    if (control.hasError('maxlength')) return `Must be at most ${control.getError('maxlength').requiredLength} characters`;
    if (this.addTaskForm.hasError('datetimeRange')) return 'Start date and time must be before due date and time.';

    return 'Invalid field';
  }

  get lists() {
    return this.listService.lists();
  }

  get textButton() {
    return this.interfaceService.selectedTask() ? 'Update Task' : 'Add Task';
  }

  get isAsideOpen() {
    return this.interfaceService.isAsideOpen();
  }

  get buttonText() {
    return this.isSubmitting
      ? (this.interfaceService.selectedTask() ? 'Updating...' : 'Adding...')
      : (this.interfaceService.selectedTask() ? 'Update Task' : 'Add Task');
  }
}
