import { TestBed } from '@angular/core/testing';

import { WebservicesService } from './webservices.service';

describe('WebservicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebservicesService = TestBed.get(WebservicesService);
    expect(service).toBeTruthy();
  });
});
