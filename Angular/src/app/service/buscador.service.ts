import { Injectable } from '@angular/core';
import { SocketConfigService2, SocketConfigService3,SocketConfigService } from '../socket-config.service'
@Injectable({
  providedIn: 'root'
})
export class BuscadorService {
  lugar:string;
  termino:string;
  constructor(private socket:SocketConfigService2,private socketnegocio:SocketConfigService3,private socketProducto:SocketConfigService) { 
  }
  Buscar(terminos){
    console.log(terminos,this.lugar);
    if(this.lugar=="clientes"){
      this.socket.emit("buscar-usuario-cliente",{termino:terminos});
    }else
    if(this.lugar=="usuarios"){
    this.socket.emit("buscar-usuario",{termino:terminos});
  }
    else
    if(this.lugar=="negocios"){
      if(this.termino=="licorerias"){
      this.socketnegocio.emit("buscar-negocio",{termino:terminos,tipo:"Licoreria"});
      }else
      if(this.termino=="sexshops"){
        this.socketnegocio.emit("buscar-negocio",{termino:terminos,tipo:"SexShop"});
      }if(this.termino=="moteles"){
        this.socketnegocio.emit("buscar-negocio",{termino:terminos,tipo:"Motel"});
      }
    }
  }
 
  
}
