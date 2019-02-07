import { UsuarioProvider } from './../../providers/usuario/usuario';
import { Usuarios } from './../../models/Usuarios';
import { SocketLoginService } from './../../services/socket-config.service';
import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {LoginPage} from "../login/login";
import { Storage } from '@ionic/storage';
import {HomePage} from "../home/home";
import { Facebook } from "@ionic-native/facebook";
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  usuario:Usuarios;
  rolUser:string="5c45ef2909d2200ea8f6db83";
  constructor(private storage: Storage,private userServ:UsuarioProvider,private facebook: Facebook,public nav: NavController,private socketLogin:SocketLoginService) {
    this.usuario=new Usuarios;
  }

  // register and go to home page
  register() {
    this.nav.setRoot(HomePage);
  }
  RegisterFacebook(dataUsuario:Usuarios){
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({usuario: dataUsuario}), clave.clave);
    this.socketLogin.emit("login-facebook", ciphertext.toString());
   
    this.socketLogin.on('respuesta-login-facebook', (data) => {
     // var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({usuario: dataUsuario}), clave.clave);
     // this.storage.set('email', usuario);
     this.userServ.UserSeCion=data;
      this.storage.set("usuario", this.encryptData(data));
    });
  }
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }

  OpenFacebook(){
    this.facebook.login(['public_profile', 'email'])
    .then(rta => {
      console.log(rta.status);
      if(rta.status == 'connected'){
        this.getInfo();
      };
    })
    .catch(error =>{
      console.error( error );
    });
  }
  logout() {
    this.facebook.logout()
      .then( res => {
        console.log(JSON.stringify(res));
      })
      .catch(e => console.log('Error logout from Facebook', e));
  }  
  getInfo(){
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender',['public_profile','email'])
    .then(data=>{

      var fecha=new Date().toUTCString();
    
     // this.usuario={nombre:data.first_name,apellidos:data.last_name,email:data.email,genero:data.gender,tiporegistro:"facebook",foto:data.picture.data.url}
      this.usuario.nombre=data.first_name;
    
      this.usuario.apellidos=data.last_name;
      this.usuario.email=data.email;
     
      this.usuario.genero=data.gender;
      
      this.usuario.tiporegistro="facebook";
      this.usuario.foto=data.picture.data.url;
    
      this.usuario.creacion={fecha:fecha} as any;
      this.usuario.modificacion={fecha:fecha} as any;
      this.usuario.rol=this.rolUser as any;
     
      this.RegisterFacebook(this.usuario);
      
    })
    .catch(error =>{
      console.error( error );
    });
  }
  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }
}
