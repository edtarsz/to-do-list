import { CommonModule } from "@angular/common";
// Se añade 'computed' a la lista de imports de @angular/core
import { Component, inject, signal, effect, OnDestroy, computed } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IconRegistryService } from "../../../global-services/icon-registry.service";
import { InterfaceService } from "../../../global-services/interface.service";
import { ListService } from "../../../global-services/lists.service";
import { List } from "../../../models/list";
import { AsideItem } from "../../aside/aside-item/aside-item";
import { IconTextButton } from "../../../global-components/icon-text-button/icon-text-button";
import { finalize } from "rxjs";

@Component({
  selector: 'app-add-list',
  imports: [AsideItem, IconTextButton, CommonModule, ReactiveFormsModule],
  templateUrl: './add-list.html',
  styleUrl: './add-list.css'
})
export class AddList implements OnDestroy {
  public interfaceService = inject(InterfaceService);
  public iconRegistryService = inject(IconRegistryService);
  public listService = inject(ListService);
  private fb = inject(FormBuilder);

  addListForm!: FormGroup;

  selectedColor = signal('#FFD6E8');
  showColorPicker = false;

  private MAX_LISTS = 12;
  public listCount = computed(() => this.listService.lists().length);
  public isListLimitReached = computed(() => this.listCount() >= this.MAX_LISTS);

  pastelColors = [
    '#4BA3C3', // azul oscuro
    '#3B9E7B', // verde intenso
    '#E76FAF', // rosa vibrante
    '#A84B4B', // rojo oscuro
    '#B8548D', // morado intenso
    '#7EB77E', // verde medio
    '#FF8C42', // naranja brillante
    '#E94C4C', // rojo intenso
    '#44B85D', // verde vivo
    '#5C92AC', // azul grisáceo
    '#E64C99', // rosa fuerte
    '#9B5FBF'  // morado
  ];

  closeIcon = this.iconRegistryService.getIcon('close');
  sendIcon = this.iconRegistryService.getIcon('send');
  addIcon = this.iconRegistryService.getIcon('add');

  constructor() {
    this.setupForm();

    effect(() => {
      this.addListForm.patchValue({ color: this.selectedColor() }, { emitEvent: false });
    });
  }

  private setupForm() {
    this.addListForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      color: [this.selectedColor(), [Validators.required]]
    });

    const currentList = this.interfaceService.selectedList();
    if (currentList && this.interfaceService.editActiveList()) {
      this.addListForm.patchValue({
        name: currentList.name,
        color: currentList.color
      });
      this.selectedColor.set(currentList.color);
    } else {
      this.addListForm.reset({ color: this.selectedColor() });
    }
  }

  ngOnDestroy() {
    this.interfaceService.setEditActiveList(false);
  }

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
    const isEditing = this.interfaceService.editActiveList();
    if (!isEditing && this.isListLimitReached()) {
      this.interfaceService.setEvent('LIMIT REACHED', `You cannot add more than ${this.MAX_LISTS} lists.`);
      this.interfaceService.setEventActive(true);
      return;
    }

    if (!this.addListForm.valid) {
      this.addListForm.markAllAsTouched();
      return;
    }

    const selectedList = this.interfaceService.selectedList();

    const listData = this.buildList();

    if (selectedList && selectedList.id && isEditing) {
      this.cleanupAndClose();

      this.listService.updateList(selectedList.id, listData)
        .subscribe({
          next: () => {
            this.interfaceService.setEventActive(true);
            this.interfaceService.setEvent('LIST UPDATED', `List has been successfully updated.`);
          },
          error: (error) => {
            console.error(error);
          }
        });
    } else {
      this.cleanupAndClose();

      this.listService.addList(listData)
        .subscribe({
          next: () => {
            this.interfaceService.setEventActive(true);
            this.interfaceService.setEvent('LIST CREATED', `List has been successfully created.`);
          },
          error: (error) => {
            console.error(error);
          }
        });
    }
  }

  cleanupAndClose() {
    this.addListForm.reset();
    this.selectedColor.set('#FFD6E8');
    this.interfaceService.selectedList.set(null);
    this.interfaceService.setEditActiveList(false);
    this.togglePopUp();
  }

  buildList(): List {
    return this.addListForm.value;
  }

  getErrorMessage(controlName: string): string {
    const control = this.addListForm.get(controlName);

    if (!control || !control.touched || !control.invalid) {
      return '';
    }

    if (control.hasError('required')) {
      return 'List name is required.';
    }

    if (control.hasError('minlength')) {
      const requiredLength = control.getError('minlength').requiredLength;
      return `List name must be at least ${requiredLength} characters long.`;
    }

    if (control.hasError('maxlength')) {
      const requiredLength = control.getError('maxlength').requiredLength;
      return `List name must not exceed ${requiredLength} characters.`;
    }

    return 'Invalid field.';
  }
}