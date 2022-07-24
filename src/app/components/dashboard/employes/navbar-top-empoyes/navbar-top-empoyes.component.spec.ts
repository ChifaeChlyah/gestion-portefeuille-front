import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTopEmpoyesComponent } from './navbar-top-empoyes.component';

describe('NavbarTopEmpoyesComponent', () => {
  let component: NavbarTopEmpoyesComponent;
  let fixture: ComponentFixture<NavbarTopEmpoyesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarTopEmpoyesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarTopEmpoyesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
