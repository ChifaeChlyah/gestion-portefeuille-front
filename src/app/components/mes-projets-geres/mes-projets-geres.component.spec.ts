import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesProjetsGeresComponent } from './mes-projets-geres.component';

describe('MesProjetsGeresComponent', () => {
  let component: MesProjetsGeresComponent;
  let fixture: ComponentFixture<MesProjetsGeresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesProjetsGeresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesProjetsGeresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
