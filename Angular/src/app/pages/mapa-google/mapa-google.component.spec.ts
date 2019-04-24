import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaGoogleComponent } from './mapa-google.component';

describe('MapaGoogleComponent', () => {
  let component: MapaGoogleComponent;
  let fixture: ComponentFixture<MapaGoogleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaGoogleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
