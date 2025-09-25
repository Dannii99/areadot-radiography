import { TestBed } from '@angular/core/testing';

import { GeneratePointsService } from './generate-points.service';

describe('GeneratePointsService', () => {
  let service: GeneratePointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratePointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
