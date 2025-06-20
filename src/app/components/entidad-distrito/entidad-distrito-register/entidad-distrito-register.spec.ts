import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntidadDistritoRegister } from './entidad-distrito-register';

describe('EntidadDistritoRegister', () => {
  let component: EntidadDistritoRegister;
  let fixture: ComponentFixture<EntidadDistritoRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntidadDistritoRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadDistritoRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
