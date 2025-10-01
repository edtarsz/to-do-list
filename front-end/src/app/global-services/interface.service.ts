import { Injectable, signal, computed } from '@angular/core';

interface InterfaceState {
    isAsideOpen: boolean;
    isProfileSettingsOpen: boolean;
    isAddListOpen: boolean;
    deleteActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
    export class InterfaceService {
    private state = signal<InterfaceState>({
        isAsideOpen: true,
        isProfileSettingsOpen: false,
        isAddListOpen: false,
        deleteActive: false
    });

    isAsideOpen = computed(() => this.state().isAsideOpen);
    isProfileSettingsOpen = computed(() => this.state().isProfileSettingsOpen);
    isAddListOpen = computed(() => this.state().isAddListOpen);
    deleteActive = computed(() => this.state().deleteActive);

    toggleAside() {
        this.state.update(v => ({ ...v, isAsideOpen: !v.isAsideOpen }));
    }

    toggleProfileSettings() {
        this.state.update(v => ({ ...v, isProfileSettingsOpen: !v.isProfileSettingsOpen }));
    }

    toggleAddList() {
        this.state.update(v => ({ ...v, isAddListOpen: !v.isAddListOpen }));
    }

    toggleDeleteActive() {
        this.state.update(v => ({ ...v, deleteActive: !v.deleteActive }));
    }

    // Used when signing out
    closeAll() {
        this.state.set({
            isAsideOpen: false,
            isProfileSettingsOpen: false,
            isAddListOpen: false,
            deleteActive: false
        });
    }
}