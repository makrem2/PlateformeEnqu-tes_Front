import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquetesReponduesComponent } from './enquetes-repondues.component';

describe('EnquetesReponduesComponent', () => {
  let component: EnquetesReponduesComponent;
  let fixture: ComponentFixture<EnquetesReponduesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquetesReponduesComponent]
    });
    fixture = TestBed.createComponent(EnquetesReponduesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
