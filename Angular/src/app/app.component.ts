import { Component } from '@angular/core';
import { clave } from './cryptoclave';
import * as CryptoJS from 'crypto-js';
import { UsuarioService } from './services/usuario.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private usuarioServ:UsuarioService){
    let cache=localStorage.getItem("usuario");
    
    if(cache!=undefined){
      let data = this.decryptData(cache);
    
    this.usuarioServ.usuarioActual=data;
    console.log(this.usuarioServ.usuarioActual);
    
    }else{
  console.log("sin DATOS EN el browser");
    }
  }
  decryptData(data) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, clave.clave);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
}
