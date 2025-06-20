import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntidadDistrito } from './entidad-distrito';
describe('EntidadDistrito', () => {
  let component: EntidadDistrito;
  let fixture: ComponentFixture<EntidadDistrito>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntidadDistrito]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntidadDistrito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
