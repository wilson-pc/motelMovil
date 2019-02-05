import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Productos } from '../../models/Productos';
import { Negocio } from '../../models/Negocio';
import { SocketConfigService } from '../../services/socket-config.service';
import { Observable } from 'rxjs';

/*
  Generated class for the ProviderProductosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProviderProductosProvider {

  listCommerce: Negocio[] = [];
  listProducts: Productos[] = [];
  commerceName: string;
  productos:Productos;

  // variables internas
  productOnly: Productos;
  commerceOnly: Negocio;

  constructor(public http: HttpClient, private productService:SocketConfigService) {
    console.log('Hello ProviderProductosProvider Provider');
 
  }

  obtenerdatosProductos(producto,parte){    
  console.log(parte);
   let newdata={termino:producto,parte:parte}
   console.log(newdata);
   this.productService.emit('listar-producto', newdata); 
  }

  respuestaProductosNegocio() {
    
    let observable = new Observable(observer => {
      this.productService.on('respuesta-listado-producto', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

 
}
