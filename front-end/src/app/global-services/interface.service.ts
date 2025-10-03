import { Injectable, signal, computed } from '@angular/core';

interface InterfaceState {
    isAsideOpen: boolean;
    isProfileSettingsOpen: boolean;
    deleteActive: boolean;
    isPopUpOpen: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class InterfaceService {
    private state = signal<InterfaceState>({
        isAsideOpen: true,
        isProfileSettingsOpen: false,
        deleteActive: false,
        isPopUpOpen: false
    });

    isAsideOpen = computed(() => this.state().isAsideOpen);
    isProfileSettingsOpen = computed(() => this.state().isProfileSettingsOpen);
    deleteActive = computed(() => this.state().deleteActive);
    isPopUpOpen = computed(() => this.state().isPopUpOpen);

    currentOperation = signal<'Add List' | 'Add Task'>('Add List');

    selectedListId = signal<number | null>(null);
    selectedMenuId = signal<number>(1);

    toggleAside() {
        this.state.update(v => ({ ...v, isAsideOpen: !v.isAsideOpen }));
    }

    toggleProfileSettings() {
        this.state.update(v => ({ ...v, isProfileSettingsOpen: !v.isProfileSettingsOpen }));
    }

    toggleDeleteActive() {
        this.state.update(v => ({ ...v, deleteActive: !v.deleteActive }));
    }

    togglePopUp() {
        this.state.update(v => ({ ...v, isPopUpOpen: !v.isPopUpOpen }));
    }

    setCurrentOperation(operation: 'Add List' | 'Add Task') {
        this.togglePopUp();
        this.currentOperation.set(operation);
    }

    // Used when signing out
    closeAll() {
        this.state.set({
            isAsideOpen: true,
            isProfileSettingsOpen: false,
            deleteActive: false,
            isPopUpOpen: false
        });

        this.selectedListId.set(null);
        this.selectedMenuId.set(1);
    }
}