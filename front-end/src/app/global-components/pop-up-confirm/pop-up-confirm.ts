import { Component, inject, Input, input } from '@angular/core';
import { IconTextButton } from "../icon-text-button/icon-text-button";
import { IconRegistryService } from '../../global-services/icon-registry.service';
import { InterfaceService } from '../../global-services/interface.service';
import { ListService } from '../../global-services/lists.service';
import { TaskService } from '../../global-services/tasks.service';
import { List } from '../../models/list';
import { Task } from '../../models/task';

@Component({
  selector: 'app-pop-up-confirm',
  imports: [IconTextButton],
  templateUrl: './pop-up-confirm.html',
  styleUrl: './pop-up-confirm.css'
})
export class PopUpConfirm {
  private interfaceService = inject(InterfaceService);
  private iconRegistryService = inject(IconRegistryService);
  private listService = inject(ListService);
  private taskService = inject(TaskService);

  closeIcon = this.iconRegistryService.getIcon('close');

  confirm() {
    const action = this.interfaceService.confirmAction();
    if (!action) return;

    if (this.isList(action)) {
      if (action.id === undefined || action.id === null) return;
      this.deleteList(action.id);
    }
    else if (this.isTask(action)) {
      if (action.id === undefined || action.id === null) return;
      this.deleteTask(action.id);
    }

    this.interfaceService.toggleDeleteActive();
    this.interfaceService.setConfirmAction(null);
    this.interfaceService.toggleShowPopUpConfirm();
  }

  // Type guards
  private isList(obj: any): obj is List {
    return obj && 'name' in obj && 'color' in obj && !('dueDate' in obj);
  }

  private isTask(obj: any): obj is Task {
    return obj && 'name' in obj && 'dueDate' in obj && 'priority' in obj;
  }

  togglePopUp() {
    if (this.interfaceService.selectedTask()) {
      this.interfaceService.selectedTask.set(null);
    }
    if (this.interfaceService.selectedList()) {
      // this.interfaceService.selectedList.set(null);
    }
    this.interfaceService.toggleShowPopUpConfirm();
  }

  deleteList(listId: number): void {
    if (this.interfaceService.deleteActive()) {
      this.listService.deleteList(listId).subscribe({
        next: () => {
          this.interfaceService.setEventActive(true);
          this.interfaceService.setEvent('LIST DELETED', `List has been successfully deleted.`);
        }
      });
    }
  }

  deleteTask(taskId: number): void {
    if (this.interfaceService.deleteActive()) {
      this.taskService.deleteTask(taskId).subscribe({
        next: () => {
          this.interfaceService.setEventActive(true);
          this.interfaceService.setEvent('TASK DELETED', `Task has been successfully deleted.`);
        }
      });
    }
  }

}
