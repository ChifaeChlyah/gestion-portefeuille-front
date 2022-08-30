import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisquesParProjetsChartComponent } from './risques-par-projets-chart.component';

describe('RisquesParProjetsChartComponent', () => {
  let component: RisquesParProjetsChartComponent;
  let fixture: ComponentFixture<RisquesParProjetsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RisquesParProjetsChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisquesParProjetsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
