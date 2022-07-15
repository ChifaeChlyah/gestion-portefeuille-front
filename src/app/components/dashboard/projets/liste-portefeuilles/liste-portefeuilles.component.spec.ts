import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePortefeuillesComponent } from './liste-portefeuilles.component';

describe('ListePortefeuillesComponent', () => {
  let component: ListePortefeuillesComponent;
  let fixture: ComponentFixture<ListePortefeuillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListePortefeuillesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListePortefeuillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
