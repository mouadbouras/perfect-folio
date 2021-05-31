import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  template: ''
})
export class BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly onInitSubject = new Subject();
  readonly onInit$ = this.onInitSubject.asObservable();

  private readonly afterViewInitSubject = new Subject();
  readonly afterViewInit$ = this.afterViewInitSubject.asObservable();

  private destroySubject = new Subject();
  readonly destroy$ = this.destroySubject.asObservable();

  ngOnInit(): void {
    this.onInitSubject.next();
  }

  ngAfterViewInit(): void {
    this.afterViewInitSubject.next();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
  }
}
