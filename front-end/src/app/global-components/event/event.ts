import { Component, inject, effect, OnDestroy, signal } from '@angular/core';
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
  private isFirstRun = true;

  // Señales locales para "congelar" los datos durante la transición
  displayTitle = signal('');
  displayMessage = signal('');

  constructor() {
    effect(() => {
      const currentTitle = this.interfaceService.titleEvent();
      const currentMessage = this.interfaceService.messageEvent();
      const eventCounter = this.interfaceService.eventCounter();
      const eventActive = this.interfaceService.isEventActive();

      // Solo procesar si el evento está activo
      if (!eventActive) return;

      const el = document.getElementById('toast');

      // Si no es la primera ejecución, hacer desaparecer el evento anterior inmediatamente
      if (!this.isFirstRun && el) {
        // Cancelar timeout previo
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        // Animación de salida rápida (SIN actualizar los datos todavía)
        el.classList.remove('animate-fade-in-up');
        el.classList.add('animate-fade-out-down');

        // Esperar a que termine la animación de salida
        setTimeout(() => {
          // AHORA SÍ actualizar los datos
          this.displayTitle.set(currentTitle);
          this.displayMessage.set(currentMessage);

          // Pequeño delay para asegurar que el DOM se actualizó
          setTimeout(() => {
            const element = document.getElementById('toast');
            if (element) {
              this.showNewEvent(element);
            }
          }, 50);
        }, 300);
      } else {
        // Primera ejecución, actualizar datos y mostrar directamente
        this.isFirstRun = false;
        this.displayTitle.set(currentTitle);
        this.displayMessage.set(currentMessage);

        if (el) {
          setTimeout(() => this.showNewEvent(el), 50);
        }
      }
    });
  }

  private showNewEvent(el: HTMLElement) {
    // Resetear la animación
    el.classList.remove('animate-fade-out-down');
    el.classList.add('animate-fade-in-up');

    // Crear nuevo timeout para el auto-cierre
    this.timeoutId = setTimeout(() => {
      const element = document.getElementById('toast');
      if (element) {
        element.classList.remove('animate-fade-in-up');
        element.classList.add('animate-fade-out-down');
      }
    }, 4000);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  closeEvent() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.interfaceService.setEventActive(false);
  }
}