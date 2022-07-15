import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInfosComponent } from './mes-infos.component';

describe('MesInfosComponent', () => {
  let component: MesInfosComponent;
  let fixture: ComponentFixture<MesInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesInfosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
