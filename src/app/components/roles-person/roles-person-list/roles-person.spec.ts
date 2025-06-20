import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesPerson } from './roles-person';
describe('RolesPerson', () => {
  let component: RolesPerson;
  let fixture: ComponentFixture<RolesPerson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPerson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPerson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
