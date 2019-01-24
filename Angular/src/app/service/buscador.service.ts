import { Injectable } from '@angular/core';
import { SocketConfigService2, SocketConfigService3,SocketConfigService } from '../socket-config.service'
@Injectable({
  providedIn: 'root'
})
export class BuscadorService {
  lugar:string;
  constructor(private socket:SocketConfigService2,private socketnegocio:SocketConfigService3,private socketProducto:SocketConfigService) { 
  }
  Buscar(termino){
    if(this.lugar=="usuarios"){
    this.socket.emit("buscar-usuario",{termino:termino});
  }
    else
    if(this.lugar=="negocios"){
      console.log("negocios");
    }
  }
 
  
}
