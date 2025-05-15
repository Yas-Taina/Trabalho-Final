import { TestBed } from '@angular/core/testing';

import { ApiServiceBase } from './api-service-base.service';

describe('ApiServiceBaseService', () => {
  let service: ApiServiceBase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiServiceBase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
