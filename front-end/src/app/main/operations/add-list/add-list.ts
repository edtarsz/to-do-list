import { CommonModule } from "@angular/common";
import { Component, inject, signal, effect } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IconRegistryService } from "../../../global-services/icon-registry.service";
import { InterfaceService } from "../../../global-services/interface.service";
import { ListService } from "../../../global-services/lists.service";
import { List } from "../../../models/list";
import { AsideItem } from "../../aside/aside-item/aside-item";
import { IconTextButton } from "../../../global-components/icon-text-button/icon-text-button";

@Component({
  selector: 'app-add-list',
  imports: [AsideItem, IconTextButton, CommonModule, ReactiveFormsModule],
  templateUrl: './add-list.html',
  styleUrl: './add-list.css'
})
export class AddList {
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
      color: [this.selectedColor(), [Validators.required]]
    });

    // { emitEvent: false } prevents angular from thinking that the user manually changed the color input
    effect(() => {
      this.addListForm.patchValue({ color: this.selectedColor() }, { emitEvent: false });
    });
  }

  pastelColors = [
    '#B6E7F2',
    '#8FD3B1',
    '#F2B6C9',
    '#D38F8F',
    '#D5A6BD',
    '#C1E1C1',
    '#FFB347',
    '#FF6961',
    '#77DD77',
    '#AEC6CF',
    '#F49AC2',
    '#CBAACB'
  ];

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