import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquetesRecuesComponent } from './enquetes-recues.component';

describe('EnquetesRecuesComponent', () => {
  let component: EnquetesRecuesComponent;
  let fixture: ComponentFixture<EnquetesRecuesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquetesRecuesComponent]
    });
    fixture = TestBed.createComponent(EnquetesRecuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
