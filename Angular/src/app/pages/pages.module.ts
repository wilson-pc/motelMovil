import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PageComponent } from './pages.component';
import { SIDEBAR_TOGGLE_DIRECTIVES } from '../shared/sidebar.directive';
import { NavigationComponent } from '../shared/header-navigation/navigation.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';
import { RegistryOwnerComponent } from './registry-owner/registry-owner.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { WalletComponent } from './wallet/wallet.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { RegistryUserComponent } from './registry-user/registry-user.component';
import { MapaGoogleComponent } from './mapa-google/mapa-google.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
    imports: [
        CommonModule,
        PagesRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
        NgMultiSelectDropDownModule.forRoot(),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAmDFQR1MLBKTwWPTW5IG31nDsPbYmJ2h4'
          })
    ],
    declarations: [
        PageComponent,
        NavigationComponent,
        SidebarComponent,
        BreadcrumbComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        RegistryOwnerComponent,
        WalletComponent,
        ComplaintComponent,
        RegistryUserComponent,
        MapaGoogleComponent,
       
       
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }
