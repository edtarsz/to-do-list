import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Event } from "../global-components/event/event";
import { AuthStateService } from '../global-services/auth-state.service';
import { InterfaceService } from '../global-services/interface.service';
import { Loading } from "../global-components/loading/loading";

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, Event, Loading],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Auth implements OnInit, OnDestroy {
  private authStateService = inject(AuthStateService);
  private interfaceService = inject(InterfaceService);

  images: string[] = [
    'assets/images/calendar.png',
    'assets/images/pop-up.png',
    'assets/images/tasks.png'
  ];

  currentIndex = 0;
  private intervalId?: number;
  private readonly INTERVAL_TIME = 5000;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.startCarousel();
  }

  ngOnDestroy() {
    this.stopCarousel();
  }

  startCarousel() {
    this.intervalId = window.setInterval(() => {
      this.nextSlide();
      this.cdr.markForCheck();
    }, this.INTERVAL_TIME);
  }

  stopCarousel() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  get isLoading(): boolean {
    return this.authStateService.isLoading();
  }

  get isEventActive(): boolean {
    return this.interfaceService.isEventActive();
  }
}
