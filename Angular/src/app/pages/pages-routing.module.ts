import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './pages.component';
import { RegistryOwnerComponent } from './registry-owner/registry-owner.component';

const routes: Routes = [
    {
        path: '', 
        component: PageComponent, 
        children: [
            { path: 'administracion', loadChildren: './starter/starter.module#StarterModule' },
            { path: 'administracion', loadChildren: './component/component.module#ComponentsModule' },
            { path: 'registro-usuarios', component: RegistryOwnerComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
