import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosView } from './casos-view';

describe('CasosView', () => {
  let component: CasosView;
  let fixture: ComponentFixture<CasosView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
