import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProjetsComponent } from './table-projets.component';

describe('TableProjetsComponent', () => {
  let component: TableProjetsComponent;
  let fixture: ComponentFixture<TableProjetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableProjetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableProjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
