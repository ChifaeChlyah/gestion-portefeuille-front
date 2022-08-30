import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetardsParPortefeuillesChartComponent } from './retards-par-portefeuilles-chart.component';

describe('RetardsParPortefeuillesChartComponent', () => {
  let component: RetardsParPortefeuillesChartComponent;
  let fixture: ComponentFixture<RetardsParPortefeuillesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetardsParPortefeuillesChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetardsParPortefeuillesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
