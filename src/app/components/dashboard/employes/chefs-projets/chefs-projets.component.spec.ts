import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefsProjetsComponent } from './chefs-projets.component';

describe('ChefsProjetsComponent', () => {
  let component: ChefsProjetsComponent;
  let fixture: ComponentFixture<ChefsProjetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChefsProjetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefsProjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
