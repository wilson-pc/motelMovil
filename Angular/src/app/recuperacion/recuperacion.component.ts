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
this.usuario=data;

     }else{
    console.log(data);
  this.invalidToken=true;
     }
    });
  }
  guardarDatos(usuario,password,password1){
    console.log(this.usuario);
    if(password==password1 && this.usuario.nombre && usuario){
      let data = { usuario:usuario,password:password,id:this.usuario._id}
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
      this.socketUsuario.emit("recuperar-login",ciphertext.toString());
      this.socketUsuario.on('respuesta-recuperar-login', (data) => {
        if(!data.error){
       this.isExito=true;
       this.isError=false;
       this.mensaje=data.exito;
        }else{
      this.isError=true;
      this.mensaje=data.error;
        }
       });
    }else{
      this.isError=true
      this.mensaje="los campos deven estar completos y las dos contraseñas deven ser iguales";
    }
  }

}
