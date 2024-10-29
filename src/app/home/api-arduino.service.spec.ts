import { TestBed } from '@angular/core/testing';

import { ApiArduinoService } from './api-arduino.service';

describe('ApiArduinoService', () => {
  let service: ApiArduinoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiArduinoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
