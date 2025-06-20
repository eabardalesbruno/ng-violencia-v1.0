import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonasRegister } from './personas-register';

describe('PersonasRegister', () => {
  let component: PersonasRegister;
  let fixture: ComponentFixture<PersonasRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonasRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonasRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
