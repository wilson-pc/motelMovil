import { Component } from "@angular/core";
import { NavController, AlertController, ToastController, MenuController } from "ionic-angular";
import { HomePage } from "../home/home";
import { Usuarios } from "../../models/Usuarios";
import { SocketServiceUser } from "../../providers/socket-config/socket-config";
import * as CryptoJS from 'crypto-js';
import { clave } from "../../app/cryptoclave";
import { Observable } from "rxjs";
import { UserOnlyProvider } from "../../providers/user-only/user-only";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // Variables de recuperacion HTML
  userInput: string;
  passInput: string;

  constructor(
    public nav: NavController,
    public forgotCtrl: AlertController,
    public menu: MenuController,
    public toastCtrl: ToastController,
    public userSocket: SocketServiceUser,
    public userOnlyProvider: UserOnlyProvider) {
    // Inicializacion
    this.menu.swipeEnable(false);
    this.connectionBackendSocket();
  }

  // Iniciar sesión e ir a la página de inicio
  login() {
    // Consulta de validacion de usuario
    var ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify({ usuario: this.userInput, password: this.passInput, tipo: "Admin" }), clave.clave);
    this.userSocket.emit("login-usuario", ciphertext.toString());
  }

  // Modal recuperacion de contraseña
  forgotPass() {
    let forgot = this.forgotCtrl.create({
      title: 'Se te olvido tu contraseña?',
      message: "Ingrese su dirección de correo electrónico para enviar una contraseña de enlace de restablecimiento.",
      inputs: [
        {
          name: 'email',
          placeholder: 'Correo Electronico',
          type: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancelar clicked');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            console.log('Enviar clicked');
            let toast = this.toastCtrl.create({
              message: 'El correo electrónico fue enviado exitosamente',
              duration: 3000,
              position: 'top',
              cssClass: 'dark-trans',
              closeButtonText: 'OK',
              showCloseButton: true
            });
            toast.present();
          }
        }
      ]
    });
    forgot.present();
  }

  // Encriptacion de para localStorage
  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave).toString();
    } catch (e) {
      console.log(e);
    }
  }

  // Conexion con en Backend
  connectionBackendSocket() {
    this.respuestaLogin().subscribe((data: any) => {
      if (data.token) {
        // Guardado en localStorage
        localStorage.setItem("usuario", this.encryptData(data));
        console.log("Guardando informacion en local storage");
        // Redireccion a la Pagina Principal
        this.nav.setRoot(HomePage);
        this.userOnlyProvider.userSesion = data;
      }
      else {
        console.log("error");
      }
    });
  }

  respuestaLogin() {
    let observable = new Observable(observer => {
      this.userSocket.on('respuesta-login', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }
}
