import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { InterfaceService } from '../../../services/interface.service';
import { AsideItem } from "../../aside-item/aside-item";
import { IconTextButton } from "../../icon-text-button/icon-text-button";
import { IconRegistryService } from '../../../services/icon-registry.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-list',
  imports: [AsideItem, IconTextButton, CommonModule],
  templateUrl: './add-list.html',
  styleUrl: './add-list.css'
})
export class AddList {
  public interfaceService = inject(InterfaceService);
  public iconRegistryService = inject(IconRegistryService);

  selectedColor = '#FFD6E8';
  showColorPicker = false;

  pastelColors = [
    '#B6E7F2',
    '#8FD3B1',
    '#F2B6C9',
    '#FFFACD',
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

  toggleAddList() {
    this.interfaceService.toggleAddList();
  }

  toggleColorPicker() {
    this.showColorPicker = !this.showColorPicker;
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.showColorPicker = false;
  }
}