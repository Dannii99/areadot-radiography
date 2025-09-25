import { TestBed } from '@angular/core/testing';

import { ImageSignalStateService } from './image-signal-state.service';

describe('ImageSignalStateService', () => {
  let service: ImageSignalStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageSignalStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
