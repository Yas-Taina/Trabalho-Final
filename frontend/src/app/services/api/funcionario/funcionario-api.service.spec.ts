import { TestBed } from '@angular/core/testing';

import { FuncionarioApiService } from './funcionario-api.service';

describe('FuncionarioApiService', () => {
  let service: FuncionarioApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FuncionarioApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
