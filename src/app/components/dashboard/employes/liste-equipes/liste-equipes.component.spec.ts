import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEquipesComponent } from './liste-equipes.component';

describe('ListeEquipesComponent', () => {
  let component: ListeEquipesComponent;
  let fixture: ComponentFixture<ListeEquipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeEquipesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeEquipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
