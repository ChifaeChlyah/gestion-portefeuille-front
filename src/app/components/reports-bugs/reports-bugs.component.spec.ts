import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsBugsComponent } from './reports-bugs.component';

describe('ReportsBugsComponent', () => {
  let component: ReportsBugsComponent;
  let fixture: ComponentFixture<ReportsBugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsBugsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsBugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
