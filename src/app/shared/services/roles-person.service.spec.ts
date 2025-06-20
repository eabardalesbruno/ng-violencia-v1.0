import { TestBed } from '@angular/core/testing';

import { RolesPersonService } from './roles-person.service';

describe('RolesPersonService', () => {
  let service: RolesPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
