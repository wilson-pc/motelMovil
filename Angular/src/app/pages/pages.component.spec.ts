import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../web/header/header.component';

describe('LayoutComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      NgbDropdownModule.forRoot(),
    ],
      declarations: [
        HeaderComponent,
        SidebarComponent,
      ]
    })
    .compileComponents();
  }));
});
