import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-item',
  imports: [],
  templateUrl: './list-item.html',
  styleUrl: './list-item.css'
})
export class ListItem {
  @Input() title!: string;
  @Input() color!: string;
}
