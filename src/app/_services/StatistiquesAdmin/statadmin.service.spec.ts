import { TestBed } from '@angular/core/testing';

import { StatadminService } from './statadmin.service';

describe('StatadminService', () => {
  let service: StatadminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatadminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
