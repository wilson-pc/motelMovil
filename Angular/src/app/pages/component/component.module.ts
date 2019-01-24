import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ComponentsRoutes } from './component.routing';
import { ListCommerceComponent } from './list-commerce/list-commerce.component';
import { ListProductComponent } from './list-product/list-product.component';
import { FormComerceComponent } from './form-comerce/form-comerce.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ComponentsRoutes),
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    NgbModule
  ],
  declarations: [
    ListCommerceComponent,
    ListProductComponent,
    FormComerceComponent
  ]
})

export class ComponentsModule {}