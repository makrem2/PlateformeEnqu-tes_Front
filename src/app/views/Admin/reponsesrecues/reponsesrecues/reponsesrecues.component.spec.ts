import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReponsesrecuesComponent } from './reponsesrecues.component';

describe('ReponsesrecuesComponent', () => {
  let component: ReponsesrecuesComponent;
  let fixture: ComponentFixture<ReponsesrecuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReponsesrecuesComponent]
    });
    fixture = TestBed.createComponent(ReponsesrecuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
