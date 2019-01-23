import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { WebRoutes } from './web.routing';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(WebRoutes),
    ],
    declarations: [
        HomeComponent,
        HeaderComponent,
        FooterComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class WebModule { }
