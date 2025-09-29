import { Component, inject, Signal } from '@angular/core';
import { ListService } from '../services/lists.service';
import { ListItem } from "./list-item/list-item";
import { IconTextButton } from './icon-text-button/icon-text-button';

@Component({
  selector: 'app-aside',
  imports: [ListItem, IconTextButton],
  templateUrl: './aside.html',
  styleUrl: './aside.css'
})
export class Aside {
  public listService = inject(ListService);

  trashIcon = `
    <path d="M7.08325 7.79169V12.0417" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.91675 7.79169V12.0417" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M13.4584 4.25V14.1667C13.4584 14.5424 13.3092 14.9027 13.0435 15.1684C12.7778 15.4341 12.4175 15.5833 12.0417 15.5833H4.95841C4.58269 15.5833 4.22236 15.4341 3.95668 15.1684C3.691 14.9027 3.54175 14.5424 3.54175 14.1667V4.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.125 4.25H14.875" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.66675 4.25002V2.83335C5.66675 2.45763 5.816 2.0973 6.08168 1.83162C6.34736 1.56594 6.70769 1.41669 7.08341 1.41669H9.91675C10.2925 1.41669 10.6528 1.56594 10.9185 1.83162C11.1842 2.0973 11.3334 2.45763 11.3334 2.83335V4.25002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `;

  addIcon = `
    <path d="M4.375 10.5H16.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10.5 4.375V16.625" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  `;
}
