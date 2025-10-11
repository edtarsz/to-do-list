import { Injectable, signal, computed } from '@angular/core';
import { List } from '../models/list';
import { Task } from '../models/task';

interface InterfaceState {
    isAsideOpen: boolean;
    isProfileSettingsOpen: boolean;
    deleteActive: boolean;
    editActiveList: boolean;
    editActiveTask: boolean;
    isPopUpOpen: boolean;
    isShowingDetailsTask: boolean;
    isEventActive: boolean;
    showUpdateProfile: boolean;
    showCompletedTasks: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class InterfaceService {
    private state = signal<InterfaceState>({
        isAsideOpen: true,
        isProfileSettingsOpen: false,
        deleteActive: false,
        editActiveList: false,
        editActiveTask: false,
        isPopUpOpen: false,
        isShowingDetailsTask: false,
        isEventActive: false,
        showUpdateProfile: false,
        showCompletedTasks: false
    });

    isAsideOpen = computed(() => this.state().isAsideOpen);
    isProfileSettingsOpen = computed(() => this.state().isProfileSettingsOpen);
    deleteActive = computed(() => this.state().deleteActive);
    editActiveList = computed(() => this.state().editActiveList);
    editActiveTask = computed(() => this.state().editActiveTask);
    isPopUpOpen = computed(() => this.state().isPopUpOpen);
    showUpdateProfile = computed(() => this.state().showUpdateProfile);
    showCompletedTasks = computed(() => this.state().showCompletedTasks);

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
        if (this.state().editActiveList) {
            this.state.update(v => ({ ...v, editActiveList: false }));
        }
        this.state.update(v => ({ ...v, deleteActive: !v.deleteActive }));
    }

    setEditActiveList(active: boolean) {
        if (this.state().deleteActive) {
            this.state.update(v => ({ ...v, deleteActive: false }));
        }
        this.state.update(v => ({ ...v, editActiveList: active }));
    }

    setEditActiveTask(active: boolean) {
        this.state.update(v => ({ ...v, editActiveTask: active }));
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

    setShowUpdateProfile(show: boolean) {
        this.state.update(v => ({ ...v, showUpdateProfile: show }));
    }

    setShowCompletedTasks(show: boolean) {
        this.state.update(v => ({ ...v, showCompletedTasks: show }));
    }

    // Used when signing out
    closeAll() {
        this.state.set({
            isAsideOpen: true,
            isProfileSettingsOpen: false,
            deleteActive: false,
            editActiveList: false,
            editActiveTask: false,
            isPopUpOpen: false,
            isShowingDetailsTask: false,
            isEventActive: false,
            showUpdateProfile: false,
            showCompletedTasks: false
        });

        this.selectedTask.set(null);
        this.selectedList.set(null);
        this.selectedMenuId.set(1);
    }
}