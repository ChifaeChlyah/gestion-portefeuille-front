import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesProjetsAffecteComponent } from './mes-projets-affecte.component';

describe('MesProjetsAffecteComponent', () => {
  let component: MesProjetsAffecteComponent;
  let fixture: ComponentFixture<MesProjetsAffecteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesProjetsAffecteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesProjetsAffecteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
