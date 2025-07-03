import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosEdit } from './casos-edit';

describe('CasosEdit', () => {
  let component: CasosEdit;
  let fixture: ComponentFixture<CasosEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
