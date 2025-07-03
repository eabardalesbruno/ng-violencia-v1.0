import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosRegister } from './casos-register';

describe('CasosRegister', () => {
  let component: CasosRegister;
  let fixture: ComponentFixture<CasosRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
