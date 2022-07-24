import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelEmployeComponent } from './nouvel-employe.component';

describe('NouvelEmployeComponent', () => {
  let component: NouvelEmployeComponent;
  let fixture: ComponentFixture<NouvelEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelEmployeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
