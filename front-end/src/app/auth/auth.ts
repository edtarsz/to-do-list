import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Auth implements OnInit, OnDestroy {
  images = [
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
}
