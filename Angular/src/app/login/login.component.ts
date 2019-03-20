import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketConfigService2 } from '../socket-config.service';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { clave } from '../cryptoclave';
import { UsuarioService } from '../services/usuario.service';
import { Usuarios } from '../models/Usuarios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isError:boolean=false;
  isExito:boolean=false;
  recordar: boolean = false;
  isRequired:boolean=false;
  usuario: Usuarios;

  constructor(private socket:SocketConfigService2,private rout: Router,public usuarioServ:UsuarioService) { 
    
		this.usuario = new Usuarios;
    this.conn();
  }

  ngOnInit() {
  }

  crearAdminlevel0(){

  }

  login(user: string, pass: string){
   
 
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({usuario:user,password:pass,tipo:"SuperAdmin"}), clave.clave);
      this.socket.emit("login-usuario",ciphertext.toString());
      //this.rout.navigate(['/administracion']);
    
    
    //this.rout.navigate(['/administracion']);
  }
  encryptData(data) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }
  conn(){
    this.respuestaLogin().subscribe((data:any) => {
		  
     if(data.token){
       
			this.isError = false;
			this.isRequired = false;
      this.isExito = false;
     // this.rout.navigate(['/administracion']);
      if(this.recordar=true){
        this.usuarioServ.usuarioActual=data;
        localStorage.setItem("usuario", this.encryptData(data));
        this.rout.navigate(['/administracion']);
        
       }else{
        this.usuarioServ.usuarioActual=data;
        //http://localhost:4200/lista-productos/page/1
        this.rout.navigate(['/administracion']);
         
       }
		 }
		 else{
       console.log("eeeror");
			this.isError = true;
			this.isRequired = true;
      this.isExito = true;
     
		 }
		});
  }
  respuestaLogin() {
    let observable = new Observable(observer => {
      this.socket.on('respuesta-login', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  //CREAR UN SUPER ADMIN
  createSuperAdmin(){
   
    this.socket.emit('registrar-sa');
    
  }
}
