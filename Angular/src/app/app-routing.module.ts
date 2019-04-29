import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WebComponent } from './web/web.component';
import { LoginComponent } from './login/login.component';
import { Error404Component } from './pages/error404/error404.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';

const routes: Routes = [
    {
        path: '',
        redirectTo:'inicio',
        pathMatch:'full'
    },
   
    {
        path: '',
        component: WebComponent,
        children: [
        {
          path: '',
          loadChildren: './web/web.module#WebModule'
        }]
    },

    {
        path: '',
        loadChildren: './pages/pages.module#PagesModule'
    },
    { path: 'login', component: LoginComponent },
    { path: 'recuperacion/:token', component: RecuperacionComponent },
    { path: '404', component: Error404Component},
    { path: '**', redirectTo: '/404'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes), NgbModule.forRoot()],
    exports: [RouterModule]
})
export class AppRoutingModule { }
