import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryOwnerComponent } from './registry-owner.component';

describe('RegistryOwnerComponent', () => {
  let component: RegistryOwnerComponent;
  let fixture: ComponentFixture<RegistryOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistryOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
