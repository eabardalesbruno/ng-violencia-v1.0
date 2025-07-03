import { TestBed } from '@angular/core/testing';
import { EntidadDistritoService } from './entidad-distrito.service';

describe('EntidadDistritoService', () => {
  let service: EntidadDistritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntidadDistritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});