import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryUserComponent } from './registry-user.component';

describe('RegistryUserComponent', () => {
  let component: RegistryUserComponent;
  let fixture: ComponentFixture<RegistryUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistryUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistryUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
