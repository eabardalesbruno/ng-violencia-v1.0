import { TestBed } from '@angular/core/testing';

import { PersonaRolesVistaService } from './persona-roles-vista.service';

describe('PersonaRolesVistaService', () => {
  let service: PersonaRolesVistaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonaRolesVistaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
