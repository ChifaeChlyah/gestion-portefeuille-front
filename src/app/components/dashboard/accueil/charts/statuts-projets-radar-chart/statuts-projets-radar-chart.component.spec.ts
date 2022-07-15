import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatutsProjetsRadarChartComponent } from './statuts-projets-radar-chart.component';

describe('StatutsProjetsRadarChartComponent', () => {
  let component: StatutsProjetsRadarChartComponent;
  let fixture: ComponentFixture<StatutsProjetsRadarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatutsProjetsRadarChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatutsProjetsRadarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
