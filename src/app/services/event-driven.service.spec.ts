import { TestBed } from '@angular/core/testing';

import { EventDrivenService } from './event-driven.service';

describe('EventDrivenService', () => {
  let service: EventDrivenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventDrivenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
