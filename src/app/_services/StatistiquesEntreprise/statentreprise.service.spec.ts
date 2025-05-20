import { TestBed } from '@angular/core/testing';

import { StatentrepriseService } from './statentreprise.service';

describe('StatentrepriseService', () => {
  let service: StatentrepriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatentrepriseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
