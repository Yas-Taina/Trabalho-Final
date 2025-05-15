import { TestBed } from '@angular/core/testing';

import { ApiClientBase } from './api-client-base.service';

describe('ApiClientBaseService', () => {
  let service: ApiClientBase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiClientBase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
