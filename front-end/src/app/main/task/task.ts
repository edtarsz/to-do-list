import { Component, inject } from '@angular/core';
import { AuthStateService } from '../../global-services/auth-state.service';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.html',
  styleUrl: './task.css'
})
export class Task {
  public authStateService = inject(AuthStateService);
}
