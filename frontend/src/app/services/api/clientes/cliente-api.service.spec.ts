import { TestBed } from '@angular/core/testing';

import { ClienteApiService } from './cliente-api.service';

describe('ClienteService', () => {
  let service: ClienteApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
