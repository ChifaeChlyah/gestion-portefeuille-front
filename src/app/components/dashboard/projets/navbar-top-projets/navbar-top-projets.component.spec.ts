import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarTopProjetsComponent } from './navbar-top-projets.component';

describe('NavbarTopProjetsComponent', () => {
  let component: NavbarTopProjetsComponent;
  let fixture: ComponentFixture<NavbarTopProjetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarTopProjetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarTopProjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
