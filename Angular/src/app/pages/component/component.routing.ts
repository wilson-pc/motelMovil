import { Routes } from '@angular/router';

import { ListCommerceComponent } from './list-commerce/list-commerce.component';
import { ListProductComponent } from './list-product/list-product.component';
import { FormComerceComponent } from './form-comerce/form-comerce.component';

export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'negocio',
        component: ListCommerceComponent,
        data: {
          title: 'negocio',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'Pagination' }]
        }
      },
      {
        path: 'negocio/lista-productos',
        component: ListProductComponent,
        data: {
          title: 'lista-productos',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'Pagination' }]
        }
      },

      {
        path: 'formulario-negocios',
        component: FormComerceComponent,
        data: {
          title: 'Formularios de Negocios',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'Pagination' }]
        }
      }]
  }
];
