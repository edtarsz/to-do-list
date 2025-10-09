import { Component, inject, effect, OnDestroy } from '@angular/core';
import { InterfaceService } from '../../global-services/interface.service';

@Component({
  selector: 'app-event',
  imports: [],
  templateUrl: './event.html',
  styleUrl: './event.css'
})
export class Event implements OnDestroy {
  private interfaceService = inject(InterfaceService);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  title = this.interfaceService.titleEvent();
  message = this.interfaceService.messageEvent();

  constructor() {
    effect(() => {
      const currentTitle = this.interfaceService.titleEvent();
      const currentMessage = this.interfaceService.messageEvent();

      // Si hay un timeout previo, cancelarlo
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      // Resetear la animación
      const el = document.getElementById('toast');
      if (el) {
        el.classList.remove('animate-fade-out-down');
        el.classList.add('animate-fade-in-up');
      }

      // Crear nuevo timeout
      this.timeoutId = setTimeout(() => {
        const el = document.getElementById('toast');
        if (el) {
          el.classList.remove('animate-fade-in-up');
          el.classList.add('animate-fade-out-down');
        }
      }, 4000);
    });
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}