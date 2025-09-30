import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InterfaceService {
    isAsideOpen = signal(true);

    toggleAside() {
        this.isAsideOpen.update(v => !v);
    }
}