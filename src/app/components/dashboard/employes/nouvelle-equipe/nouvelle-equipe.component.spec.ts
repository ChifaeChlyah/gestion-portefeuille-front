import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleEquipeComponent } from './nouvelle-equipe.component';

describe('NouvelleEquipeComponent', () => {
  let component: NouvelleEquipeComponent;
  let fixture: ComponentFixture<NouvelleEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleEquipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
