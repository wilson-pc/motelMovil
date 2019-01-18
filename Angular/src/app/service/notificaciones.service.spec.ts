import { TestBed, inject } from '@angular/core/testing';

import { NotificacionesService } from './notificaciones.service';

describe('NotificacionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificacionesService]
    });
  });

  it('should be created', inject([NotificacionesService], (service: NotificacionesService) => {
    expect(service).toBeTruthy();
  }));
});
