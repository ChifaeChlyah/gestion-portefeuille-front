import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauProjetComponent } from './nouveau-projet.component';

describe('NouveauProjetComponent', () => {
  let component: NouveauProjetComponent;
  let fixture: ComponentFixture<NouveauProjetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouveauProjetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauProjetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
