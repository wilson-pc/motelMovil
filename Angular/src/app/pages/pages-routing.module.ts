import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageComponent } from './pages.component';

const routes: Routes = [
    {
        path: '', 
        component: PageComponent, 
        children: [
            { path: 'administracion', loadChildren: './starter/starter.module#StarterModule' },
            { path: 'administracion', loadChildren: './component/component.module#ComponentsModule' },
            { path: 'registro-usuarios', loadChildren: './starter/starter.module#StarterModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
