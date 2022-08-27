import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDateFinPrevueComponent } from './dialog-date-fin-prevue.component';

describe('DialogDateFinPrevueComponent', () => {
  let component: DialogDateFinPrevueComponent;
  let fixture: ComponentFixture<DialogDateFinPrevueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDateFinPrevueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDateFinPrevueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
