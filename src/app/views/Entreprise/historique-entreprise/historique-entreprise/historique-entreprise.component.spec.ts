import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueEntrepriseComponent } from './historique-entreprise.component';

describe('HistoriqueEntrepriseComponent', () => {
  let component: HistoriqueEntrepriseComponent;
  let fixture: ComponentFixture<HistoriqueEntrepriseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoriqueEntrepriseComponent]
    });
    fixture = TestBed.createComponent(HistoriqueEntrepriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
