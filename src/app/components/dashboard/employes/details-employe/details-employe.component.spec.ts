import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsEmployeComponent } from './details-employe.component';

describe('DetailsEmployeComponent', () => {
  let component: DetailsEmployeComponent;
  let fixture: ComponentFixture<DetailsEmployeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsEmployeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsEmployeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
