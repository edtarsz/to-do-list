import { Injectable, signal, computed } from '@angular/core';
import { List } from '../models/list';
import { Task } from '../models/task';

interface InterfaceState {
    isAsideOpen: boolean;
    isProfileSettingsOpen: boolean;
    deleteActive: boolean;
    editActive: boolean;
    isPopUpOpen: boolean;
    isShowingDetailsTask: boolean;
    isEventActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class InterfaceService {
    private state = signal<InterfaceState>({
        isAsideOpen: true,
        isProfileSettingsOpen: false,
        deleteActive: false,
        editActive: false,
        isPopUpOpen: false,
        isShowingDetailsTask: false,
        isEventActive: false
    });

    isAsideOpen = computed(() => this.state().isAsideOpen);
    isProfileSettingsOpen = computed(() => this.state().isProfileSettingsOpen);
    deleteActive = computed(() => this.state().deleteActive);
    editActive = computed(() => this.state().editActive);
    isPopUpOpen = computed(() => this.state().isPopUpOpen);

    // Events
    isEventActive = computed(() => this.state().isEventActive);
    titleEvent = signal('');
    messageEvent = signal('');
    eventCounter = signal(0);

    isShowingDetailsTask = computed(() => this.state().isShowingDetailsTask);

    currentOperation = signal<'Add List' | 'Add Task'>('Add List');

    selectedList = signal<List | null>(null);
    selectedTask = signal<Task | null>(null);
    selectedMenuId = signal<number>(1);

    toggleAside() {
        this.state.update(v => ({ ...v, isAsideOpen: !v.isAsideOpen }));
    }

    toggleProfileSettings() {
        this.state.update(v => ({ ...v, isProfileSettingsOpen: !v.isProfileSettingsOpen }));
    }

    toggleDeleteActive() {
        if (this.state().editActive) {
            this.state.update(v => ({ ...v, editActive: false }));
        }
        this.state.update(v => ({ ...v, deleteActive: !v.deleteActive }));
    }

    toggleEditActive() {
        if (this.state().deleteActive) {
            this.state.update(v => ({ ...v, deleteActive: false }));
        }
        this.state.update(v => ({ ...v, editActive: !v.editActive }));
    }

    togglePopUp() {
        this.state.update(v => ({ ...v, isPopUpOpen: !v.isPopUpOpen }));
    }

    setEventActive(active: boolean) {
        this.state.update(v => ({ ...v, isEventActive: active }));
    }

    setShowingDetailsTask(show: boolean) {
        this.state.update(v => ({ ...v, isShowingDetailsTask: show }));
    }

    setCurrentOperation(operation: 'Add List' | 'Add Task') {
        // you always set the operation, so if the pop-up is closed, open it and also set the operation
        this.currentOperation.set(operation);
    }

    setEvent(title: string, message: string) {
        this.titleEvent.set(title);
        this.messageEvent.set(message);
        this.eventCounter.update(v => v + 1);
    }

    // Used when signing out
    closeAll() {
        this.state.set({
            isAsideOpen: true,
            isProfileSettingsOpen: false,
            deleteActive: false,
            editActive: false,
            isPopUpOpen: false,
            isShowingDetailsTask: false,
            isEventActive: false
        });

        this.selectedTask.set(null);
        this.selectedList.set(null);
        this.selectedMenuId.set(1);
    }
}