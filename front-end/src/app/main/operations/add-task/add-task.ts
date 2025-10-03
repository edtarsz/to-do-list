import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconTextButton } from '../../icon-text-button/icon-text-button';
import { IconRegistryService } from '../../../global-services/icon-registry.service';
import { InterfaceService } from '../../../global-services/interface.service';
import { ListService } from '../../../global-services/lists.service';
import { List } from '../../../models/list';

@Component({
  selector: 'app-add-task',
  imports: [IconTextButton, CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'
})
export class AddTask {
  public interfaceService = inject(InterfaceService);
  public iconRegistryService = inject(IconRegistryService);

  private fb = inject(FormBuilder);

  public listService = inject(ListService);

  selectedColor = signal('#FFD6E8');
  showColorPicker = false;

  addListForm!: FormGroup;

  constructor() {
    this.addListForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      description: ['', [Validators.required]]
    });
  }

  closeIcon = this.iconRegistryService.getIcon('close');
  sendIcon = this.iconRegistryService.getIcon('send');
  addIcon = this.iconRegistryService.getIcon('add');

  toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  togglePopUp() {
    this.interfaceService.togglePopUp();
  }

  selectColor(color: string) {
    this.selectedColor.set(color);
    this.showColorPicker = false;
  }

  addList() {
    if (this.addListForm.valid) {
      this.listService.addList(this.buildList()).subscribe({
        next: () => {
          this.addListForm.reset();
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

  buildList(): List {
    return this.addListForm.value;
  }
}
