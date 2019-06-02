import { UsuarioProvider } from './../../providers/usuario/usuario';
import { Usuarios } from './../../models/Usuarios';
import { SocketLoginService, SocketUsuarioService2 } from './../../services/socket-config.service';
import { Component, ElementRef, ViewChild } from "@angular/core";
import { NavController, ToastController } from "ionic-angular";
import { LoginPage } from "../login/login";
import { Storage } from '@ionic/storage';
import { HomePage } from "../home/home";
import { Facebook } from "@ionic-native/facebook";
import { resizeBase64 } from 'base64js-es6';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../app/cryptoclave';

import { ReplaySubject, Observable } from 'rxjs';
import { defecto } from './imagedefault';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  usuario: Usuarios;
  rolUser: string = "Cliente";
  nombreimagen: string = "selecciona una foto";
  nombreDeUsuario: string;
  password: string;
  defaultImage: string = defecto.defecto;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(private userSocket: SocketUsuarioService2, private storage: Storage, private userServ: UsuarioProvider, private facebook: Facebook, public nav: NavController, private socketLogin: SocketLoginService, public toastCtrl: ToastController) {
    this.usuario = new Usuarios;
  }

  // register and go to home page
  register() {
    //console.log(this.usuario);
    this.usuario.login = { usuario: this.nombreDeUsuario, password: this.password, estado: false };
    if (!this.usuario.foto) {
      this.usuario.foto = this.defaultImage;
    }
    //console.log(this.usuario);
    if (this.usuario.nombre && this.usuario.nombre && this.validateEmail(this.usuario.email)
      && this.usuario.login.usuario && this.usuario.login.password) {
      this.usuario.rol = this.rolUser as any;
      var date = new Date().toUTCString();
      this.usuario.tiporegistro = "app";
      this.usuario.creacion = { fecha: date } as any
      this.usuario.modificacion = { fecha: date } as any;
      console.log(this.usuario);
      let data = { usuario: this.usuario, negocio: [] }
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
      this.userSocket.emit("registrar-usuario-cliente", ciphertext.toString());
      this.userSocket.on('respuesta-registrar-usuario-cliente', (data) => {
        if (!data.error) {
          this.nav.setRoot(LoginPage);
          let toast = this.toastCtrl.create({
            showCloseButton: true,
            cssClass: 'profile-bg',
            message: "registro con exito inicie secion",
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
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

    } else {
      let toast = this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'profile-bg',
        message: 'error debe completar todos los campos',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
    //  this.nav.setRoot(HomePage);
  }
  /*
  //Registrar el inicio de cecion de facebook en la bd
  RegisterFacebook(dataUsuario: Usuarios) {
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify({ usuario: dataUsuario }), clave.clave);
    this.socketLogin.emit("login-facebook", ciphertext.toString());

    this.socketLogin.on('respuesta-login-facebook', (data) => {

      this.userServ.UserSeCion = data;
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
  //abrirl el modal de facebook para el login
  OpenFacebook() {
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

  //Registrar el inicio de cecion de google en la bd
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
  }
  //abrir el modal de google para el login
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
   }
  //sacar los datos del usuario de facebook
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
  // go to login page
  login() {
    this.nav.setRoot(LoginPage);
  }
  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  filechoosser() {
    this.fileInput.nativeElement.click();
  }

  // Carga de la foto
  async fileChange(event) {

    // alert(event.srcElement.files[0].name);
    this.readFile(event.srcElement.files[0]).subscribe(data => {
      resizeBase64(data, 200, 150).then((result) => {

        this.usuario.foto = result;
        //  console.log(this.usuario);

      });
      // this.nombreimagen=event.srcElement.files[0].name;
      //   alert(dec.substring(0, 10));

    });
  }

  public readFile(fileToRead: File): Observable<MSBaseReader> {
    let base64Observable = new ReplaySubject<MSBaseReader>(1);
    this.nombreimagen = fileToRead.name;
    let fileReader = new FileReader();
    fileReader.onload = event => {
      base64Observable.next(fileReader.result);
    };
    fileReader.readAsDataURL(fileToRead);

    return base64Observable;
  }

}
