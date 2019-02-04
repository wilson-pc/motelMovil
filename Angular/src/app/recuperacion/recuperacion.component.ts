import { Usuarios } from './../models/Usuarios';
import { SocketConfigService2 } from './../socket-config.service';
import { Component, OnInit } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { clave } from '../cryptoclave';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.css']
})
export class RecuperacionComponent implements OnInit {
  isError:boolean=false;
  isExito:boolean=false;
  token:string;
  usuario:Usuarios;
  mensaje:string;
  invalidToken:boolean=false;
  constructor(private route:ActivatedRoute,private socketUsuario: SocketConfigService2) { 
    this.token=this.route.snapshot.paramMap.get('token');
    this.validarToken();
  }

  ngOnInit() {
  }
  
  validarToken(){
    this.socketUsuario.emit("validar-token",this.token);
    this.socketUsuario.on('respuesta-validar-token', (data) => {
     if(!data.error){
this.usuario=data.dato;
console.log(data);
     }else{
    console.log(data);
  this.invalidToken=true;
     }
    });
  }
  guardarDatos(usuario,password,password1){
    if(password==password1 && usuario.nombre){
      let data = { usuario:usuario,password:password,id:this.usuario._id}
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
    }
  }

}
