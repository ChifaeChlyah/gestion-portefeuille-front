import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisquesParProjetsBarChartComponent } from './risques-par-projets-bar-chart.component';

describe('RisquesParProjetsBarChartComponent', () => {
  let component: RisquesParProjetsBarChartComponent;
  let fixture: ComponentFixture<RisquesParProjetsBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RisquesParProjetsBarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisquesParProjetsBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
