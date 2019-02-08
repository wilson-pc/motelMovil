import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Productos } from '../../models/Productos';
import { Negocio } from '../../models/Negocio';
import { SocketConfigService } from '../../services/socket-config.service';
import { Observable } from 'rxjs';
import { listChanges } from 'angularfire2/database';

/*
  Generated class for the ProviderProductosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProviderProductosProvider {

  listLicores:Productos[]=[];
  listSexshop:Productos[]=[];
 
  constructor(public http: HttpClient, private productService:SocketConfigService) {
    console.log('Hello ProviderProductosProvider Provider');
    this.listSexshop=[];
 
  }

  // obtenerdatosProductosLicoreria(producto,parte){    

  //   let newdata={termino:producto,parte:parte}
   
  //   this.productService.emit('listar-producto', newdata); 
  //    console.log(newdata);
  //   this.respuestaProductosNegocioLicoreria().subscribe((data:Productos[])=>{
 
  //      if(this.listLicores.length==0)
  //      {
  //        console.log("esta vacio el array");
  //        data.forEach(element =>{
  //          this.listLicores.push(element);
  //        });
  //      }
  //      else{
  //        console.log("esta lleno el array perro");
  //        if(this.listLicores.length>0){
  //          data.forEach(element => {
  //            this.listLicores.forEach(element2 =>{
  //              if(element.id!=element2.id){
  //                this.listLicores.push(element);
  //              }  
  //            });            
  //          });
  //         // console.log("ese es el array de provider"+this.listLicores);
  //          console.log("este es el data"+data);
  //        }
 
  //      }
 
      
       
  //   });
  //   return this.listLicores;
  //  }
 
  //  respuestaProductosNegocioLicoreria() {
     
  //    let observable = new Observable(observer => {
  //      this.productService.on('respuesta-listado-producto', (data) => {              
  //        observer.next(data);       
  //      });
  //    })
  //    return observable;
  //  }
 
   // FUNCIONES PARA SEX SHOP
    obtenerdatosProductosSexshop(producto,parte){    
 
     let newdata={termino:producto,parte:parte}
     console.log(newdata);
     this.productService.emit('listar-producto', newdata); 
     
      
      if(this.listSexshop.length==0)
      {
        this.respuestaProductosNegocioSexshop().subscribe((data:Productos[])=>{
          data.forEach(element =>{          
            this.listSexshop.push(element);
          })
        })
       
      }
      else{
        this.respuestaProductosNegocioSexshop().subscribe((data:Productos[])=>{
        
          data.forEach(element =>{          
            this.listSexshop.push(element);
          })
        })
      }       
       //console.log(this.listSexshop);   
     return  this.listSexshop;
    }


   respuestaProductosNegocioSexshop() {
     
     let observable = new Observable(observer => {
       this.productService.on('respuesta-listado-producto', (data) => {   
         observer.next(data);      
       });
     })
     return observable;
   }
 
}
