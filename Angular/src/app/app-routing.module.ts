import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WebComponent } from './web/web.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: '',
        component: WebComponent,
        children: [
            {
          path: '',
          loadChildren: './web/web.module#WebModule'
      }]},

    {
        path: '',
        loadChildren: './pages/pages.module#PagesModule'
    },
    { path: 'login', component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes), NgbModule.forRoot()],
    exports: [RouterModule]
})
export class AppRoutingModule { }
