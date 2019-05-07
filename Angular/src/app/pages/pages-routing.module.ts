import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './pages.component';
import { RegistryOwnerComponent } from './registry-owner/registry-owner.component';
import { WalletComponent } from './wallet/wallet.component';
import { ComplaintComponent } from './complaint/complaint.component';
import { RegistryUserComponent } from './registry-user/registry-user.component';
import { MapaGoogleComponent } from './mapa-google/mapa-google.component';
import {RouteGuardService} from '../services/route-guard.service'

const routes: Routes = [
    {
        path: '', 
        component: PageComponent,
        canActivate: [RouteGuardService], 
        children: [
            { path: 'administracion', loadChildren: './starter/starter.module#StarterModule' },
            { path: 'administracion', loadChildren: './component/component.module#ComponentsModule' },
            { path: 'administradores', component: RegistryOwnerComponent },
            { path: 'usuarios', component: RegistryUserComponent },
            { path: 'billetera', component: WalletComponent },
            { path: 'denuncias', component: ComplaintComponent },
            { path: 'mapa', component: MapaGoogleComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
