import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComerceComponent } from './form-comerce.component';

describe('FormComerceComponent', () => {
  let component: FormComerceComponent;
  let fixture: ComponentFixture<FormComerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
