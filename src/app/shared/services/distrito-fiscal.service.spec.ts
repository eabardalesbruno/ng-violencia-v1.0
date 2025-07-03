import { TestBed } from '@angular/core/testing';

import { DistritoFiscalService } from './distrito-fiscal.service';

describe('DistritoFiscalService', () => {
  let service: DistritoFiscalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistritoFiscalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
