import { NgModule } from '@angular/core';
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

@NgModule({
    imports: [
        CommonModule,
        PagesRoutingModule,
        FormsModule,
        Ng2SearchPipeModule,
    ],
    declarations: [
        PageComponent,
        NavigationComponent,
        SidebarComponent,
        BreadcrumbComponent,
        SIDEBAR_TOGGLE_DIRECTIVES,
        RegistryOwnerComponent,
        WalletComponent,
        ComplaintComponent
    ]
})
export class PagesModule { }
