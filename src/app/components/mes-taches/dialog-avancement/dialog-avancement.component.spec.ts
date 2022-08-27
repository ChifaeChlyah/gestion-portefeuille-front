import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAvancementComponent } from './dialog-avancement.component';

describe('DialogAvancementComponent', () => {
  let component: DialogAvancementComponent;
  let fixture: ComponentFixture<DialogAvancementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAvancementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAvancementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
