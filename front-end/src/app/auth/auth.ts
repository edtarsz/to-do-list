import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { AuthStateService } from '../global-services/auth-state.service';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Auth implements OnInit, OnDestroy {
  private authStateService = inject(AuthStateService);

  @ViewChild('loadingSvg') set loadingSvg(element: ElementRef | undefined) {
    if (element) {
      this._loadingSvg = element;
      this.startLoadingAnimation();
    }
  }

  private _loadingSvg?: ElementRef;

  images = [
    'assets/images/calendar.png',
    'assets/images/pop-up.png',
    'assets/images/tasks.png'
  ];

  currentIndex = 0;
  private intervalId?: number;
  private readonly INTERVAL_TIME = 5000;

  constructor(private cdr: ChangeDetectorRef) { }

  startLoadingAnimation() {
    if (!this._loadingSvg) return;

    const svg = this._loadingSvg.nativeElement;
    const circles = svg.querySelectorAll('circle');

    gsap.to(svg, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      transformOrigin: '50% 50%'
    });

    gsap.to(circles, {
      strokeDashoffset: -205,
      duration: 2,
      repeat: -1,
      ease: 'linear',
      stagger: 0.2
    });
  }


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
}
