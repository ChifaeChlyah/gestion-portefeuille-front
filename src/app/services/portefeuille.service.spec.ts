import { TestBed } from '@angular/core/testing';

import { PortefeuilleService } from './portefeuille.service';

describe('PortefeuilleService', () => {
  let service: PortefeuilleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortefeuilleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
