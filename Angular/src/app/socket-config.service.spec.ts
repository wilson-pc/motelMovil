import { TestBed, inject } from '@angular/core/testing';

import { SocketConfigService } from './socket-config.service';

describe('SocketConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketConfigService]
    });
  });

  it('should be created', inject([SocketConfigService], (service: SocketConfigService) => {
    expect(service).toBeTruthy();
  }));
});
