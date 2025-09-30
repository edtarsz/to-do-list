import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class InterfaceService {
    isAsideOpen = signal(true);
    isProfileSettingsOpen = signal(false);
    isAddListOpen = signal(false);

    toggleAside() {
        this.isAsideOpen.update(v => !v);
    }

    toggleProfileSettings() {
        this.isProfileSettingsOpen.update(v => !v);
    }

    toggleAddList() {
        this.isAddListOpen.update(v => !v);
    }
}