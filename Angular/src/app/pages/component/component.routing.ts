import { Routes, ActivatedRoute } from '@angular/router';

import { ListCommerceComponent } from './list-commerce/list-commerce.component';
import { ListProductComponent } from './list-product/list-product.component';
import { FormComerceComponent } from './form-comerce/form-comerce.component';




export const ComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':tipo',
        component: ListCommerceComponent,
        data: {
          title: '',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'Pagination' }]
        }
      },
      
      //Sub Division de hijos URL
      {
        path: 'moteles/:nombreNeg',
        component: ListProductComponent,
        data: {
          title: '',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'Pagination' }]
        }
      },

      {
        path: 'licorerias/:nombreNeg',
        component: ListProductComponent,
        data: {
          title: '',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'Pagination' }]
        }
      },

      {
        path: 'sexshops/:nombreNeg',
        component: ListProductComponent,
        data: {
          title: '',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'Pagination' }]
        }
      },

      {
        path: 'formulario/:negocio',
        component: FormComerceComponent,
        data: {
          title: 'Formulario de Registro',
          urls: [{ title: 'Dashboard', url: '/dashboard' }, { title: 'ngComponent' }, { title: 'Pagination' }]
        }
      }]
  }
];
