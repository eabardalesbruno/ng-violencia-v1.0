import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPersonRegister } from './roles-person-register';

describe('RolesPersonRegister', () => {
  let component: RolesPersonRegister;
  let fixture: ComponentFixture<RolesPersonRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPersonRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPersonRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
