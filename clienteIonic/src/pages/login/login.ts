import { Usuarios } from './../../models/Usuarios';
import { Component } from "@angular/core";
import { NavController, AlertController, ToastController, MenuController } from "ionic-angular";
import { RegisterPage } from "../register/register";
import { Facebook } from "@ionic-native/facebook";
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';
import { UsuarioProvider } from './../../providers/usuario/usuario';
import { Storage } from '@ionic/storage';
import { SocketLoginService, SocketUsuarioService2 } from '../../services/socket-config.service';
import { TabsPage } from '../tabs/tabs';
import { copyInputAttributes } from 'ionic-angular/umd/util/dom';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  rolUser: string = "Cliente";
  usuario: Usuarios;
  loginUser: any = { usuario: "", password: "", tipo: "Cliente" };
  constructor(private storage: Storage, private socketForgotPass: SocketUsuarioService2, private userServ: UsuarioProvider, private socketLogin: SocketLoginService, private facebook: Facebook, public nav: NavController, public forgotCtrl: AlertController, public menu: MenuController, public toastCtrl: ToastController) {
    this.menu.swipeEnable(false);
    this.usuario = new Usuarios;
    this.connectonSocket();
    console.log(this.loginUser);
  }
  /*
  loginFacebook() {
    this.facebook.login(['public_profile', 'email'])
      .then(rta => {
        console.log(rta.status);
        if (rta.status == 'connected') {
          this.getInfo();
        };
      })
      .catch(error => {
        console.error(error);
      });
  }
  logout() {
    this.facebook.logout()
      .then(res => {
        console.log(JSON.stringify(res));
      })
      .catch(e => console.log('Error logout from Facebook', e));
  }
  RegisterFacebook(dataUsuario: Usuarios) {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ usuario: dataUsuario }), clave.clave);
    this.socketLogin.emit("login-facebook", ciphertext.toString());
    this.socketLogin.on('respuesta-login-facebook', (data) => {
      if (!data.error) {
        this.userServ.UserSeCion = data;
        this.storage.set("usuario", this.encryptData(data));
      } else {
        let toast = this.toastCtrl.create({
          showCloseButton: true,
          cssClass: 'profile-bg',
          message: data.error,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }
  getInfo() {
    this.facebook.api('/me?fields=id,name,email,first_name,picture,last_name,gender', ['public_profile', 'email'])
      .then(data => {

        var fecha = new Date().toUTCString();

        // this.usuario={nombre:data.first_name,apellidos:data.last_name,email:data.email,genero:data.gender,tiporegistro:"facebook",foto:data.picture.data.url}
        this.usuario.nombre = data.first_name;

        this.usuario.apellidos = data.last_name;
        this.usuario.email = data.email;

        this.usuario.genero = data.gender;

        this.usuario.tiporegistro = "facebook";
        this.usuario.foto = data.picture.data.url;

        this.usuario.creacion = { fecha: fecha } as any;
        this.usuario.modificacion = { fecha: fecha } as any;
        this.usuario.rol = this.rolUser as any;

        this.RegisterFacebook(this.usuario);

      })
      .catch(error => {
        console.error(error);
      });
  }*/
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }
  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  irHome() {
    this.nav.setRoot(TabsPage);
  }

  /*
    RegisterGoogle(dataUsuario: Usuarios) {
      alert(JSON.stringify(dataUsuario));
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ usuario: dataUsuario }), clave.clave);
      this.socketLogin.emit("login-googlepus", ciphertext.toString());
      this.socketLogin.on('respuesta-login-googlepus', (data) => {
  
        if (!data.error) {
          this.userServ.UserSeCion = data;
          this.storage.set("usuario", this.encryptData(data));
        } else {
          let toast = this.toastCtrl.create({
            showCloseButton: true,
            cssClass: 'profile-bg',
            message: data.error,
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
      });
    }*/
  /* loginGoogle(){
      this.googlePlus.login({})
    .then(data =>{
      var fecha=new Date().toUTCString();
     
      this.usuario.nombre=data.givenName;
      
      this.usuario.apellidos=data.familyName;
      this.usuario.email=data.email;
     
      this.usuario.genero=undefined;
      
      this.usuario.tiporegistro="googleplus";
      this.usuario.foto=data.imageUrl;
    
      this.usuario.creacion={fecha:fecha} as any;
      this.usuario.modificacion={fecha:fecha} as any;
      this.usuario.rol=this.rolUser as any;
      this.RegisterGoogle(this.usuario);
    })
    .catch(err => console.error(err));
    }*/
  // login and go to home page
  login() {
    console.log(this.loginUser + "yuio");
    if (this.loginUser.usuario != "" && this.loginUser.password != "") {
      var datos = this.encryptData(this.loginUser);
      this.socketLogin.emit("login-usuario-clientes", datos);
      console.log(this.loginUser);
    } else {
      let toast = this.toastCtrl.create({
        message: 'Debe completar los campos usuario y/o password',
        duration: 3000,
        position: 'top',
        cssClass: 'dark-trans',
        closeButtonText: 'OK',
        showCloseButton: true
      });
      toast.present();
    }

  }

  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Olvidaste tu Contraseña?',
      message: "Ingrese su dirección de correo electrónico para enviar una contraseña de enlace de restablecimiento.",
      inputs: [
        {
          name: 'Correo',
          placeholder: 'Correo',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Recuperacion de contraseña Cancelado');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            var d = { email: data.Correo };
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(d), clave.clave);
            this.socketForgotPass.emit("correo-recuperacion", ciphertext.toString());

            this.socketForgotPass.on("correo-recuperacion", (resp) => {
              console.log(resp);
              let toast = this.toastCtrl.create({
                message: resp.error,
                duration: 3000,
                position: 'top',
                cssClass: 'dark-trans',
                closeButtonText: 'OK',
                showCloseButton: true
              });
              console.log('Recuperar contraseña enviado');
              toast.present();
            });
            
          }
        }
      ]
    });
    forgot.present();
  }

  connectonSocket() {
    this.socketLogin.on('respuesta-login', (data) => {

      if (!data.mensaje) {
        console.log("esto es el login data:", data);
        this.userServ.UserSeCion = data;
        this.storage.set("usuario", this.encryptData(data));
        // localStorage.setItem("usuario", this.encryptData(data));
        /* 
        
         localStorage.clear();
          // Redirecionar al Login
          this.nav.setRoot(LoginPage);
        */
        this.loginUser.usuario = "";
        this.loginUser.password = "";
        this.nav.setRoot(TabsPage);
      } else {
        let toast = this.toastCtrl.create({
          showCloseButton: true,
          cssClass: 'profile-bg',
          message: data.mensaje,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    });
  }

}
