import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconTextButton } from '../../../global-components/icon-text-button/icon-text-button';
import { IconRegistryService } from '../../../global-services/icon-registry.service';
import { InterfaceService } from '../../../global-services/interface.service';
import { TaskService } from '../../../global-services/tasks.service';
import { Task } from '../../task/task';
import { ListService } from '../../../global-services/lists.service';
import { AsideItem } from "../../aside/aside-item/aside-item";

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

  showList = false;
  showPriority = false;
  showStartTime = false;
  showDueTime = false;
  showStartDate = false;
  showDueDate = false;
  
  selectedList = signal<string>('List');

  addTaskForm!: FormGroup;

  constructor() {
    this.addTaskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      list: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      dueTime: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
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

  buildTask(): Task {
    return this.addTaskForm.value;
  }

  toggleList() {
    this.showList = !this.showList;
  }

  togglePriority() {
    this.showPriority = !this.showPriority;
  }

  toggleStartTime() {
    this.showStartTime = !this.showStartTime;
  }

  toggleDueTime() {
    this.showDueTime = !this.showDueTime;
  }

  toggleStartDate() {
    this.showStartDate = !this.showStartDate;
  }

  toggleDueDate() {
    this.showDueDate = !this.showDueDate;
  }

  selectList(listId: number) {
    this.addTaskForm.patchValue({ list: listId });
    this.selectedList.set(this.lists.find(list => list.id === listId)?.name || 'List');
    this.showList = false;
  }

  get lists() {
    return this.listService.lists();
  }
}
