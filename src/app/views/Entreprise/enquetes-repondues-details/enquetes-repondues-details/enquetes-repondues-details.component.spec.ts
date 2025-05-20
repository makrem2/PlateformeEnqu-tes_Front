import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquetesReponduesDetailsComponent } from './enquetes-repondues-details.component';

describe('EnquetesReponduesDetailsComponent', () => {
  let component: EnquetesReponduesDetailsComponent;
  let fixture: ComponentFixture<EnquetesReponduesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnquetesReponduesDetailsComponent]
    });
    fixture = TestBed.createComponent(EnquetesReponduesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
