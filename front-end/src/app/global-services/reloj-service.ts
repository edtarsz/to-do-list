import { Injectable } from '@angular/core';
import { Observable, interval, map, shareReplay, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelojService {

  private fechaHora$: Observable<string> = interval(1000).pipe(
    // Emit the current date and time every second
    startWith(0),
    map(() => {
      const now = new Date();

      const opciones: Intl.DateTimeFormatOptions = {
        weekday: 'long',   // Saturday
        year: 'numeric',   // 2025
        month: 'long',     // October
        day: 'numeric',    // 4
        hour: 'numeric',   // 10
        minute: '2-digit', // 23
        second: '2-digit', // 45
        hour12: true       // 12-hour format with AM/PM
      };

      // English Format (EE.UU.)
      const fechaHora = now.toLocaleString('en-US', opciones);

      return fechaHora;
    }),

    // Share replay makes sure all subscribers get the same latest value without re-executing the observable
    shareReplay(1)
  );

  getFechaHora(): Observable<string> {
    return this.fechaHora$;
  }
}