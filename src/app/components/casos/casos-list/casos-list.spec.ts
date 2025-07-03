import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasosList } from './casos-list';

describe('CasosList', () => {
  let component: CasosList;
  let fixture: ComponentFixture<CasosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CasosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
