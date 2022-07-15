import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauPortefeuilleComponent } from './nouveau-portefeuille.component';

describe('NouveauPortefeuilleComponent', () => {
  let component: NouveauPortefeuilleComponent;
  let fixture: ComponentFixture<NouveauPortefeuilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauPortefeuilleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauPortefeuilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
