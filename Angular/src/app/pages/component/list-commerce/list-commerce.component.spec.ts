import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCommerceComponent } from './list-commerce.component';

describe('ListCommerceComponent', () => {
  let component: ListCommerceComponent;
  let fixture: ComponentFixture<ListCommerceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCommerceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
