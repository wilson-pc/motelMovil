import {Component} from "@angular/core";
import {NavController, AlertController, ToastController, MenuController} from "ionic-angular";
import {HomePage} from "../home/home";
import {RegisterPage} from "../register/register";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public nav: NavController, public forgotCtrl: AlertController, public menu: MenuController, public toastCtrl: ToastController) {
    this.menu.swipeEnable(false);
  }

  // go to register page
  register() {
    this.nav.setRoot(RegisterPage);
  }

  // login and go to home page
  login() {
    this.nav.setRoot(HomePage);
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
          handler: data => {
            console.log('Recuperacion de contraseña Cancelado');
          }
        },
        {
          text: 'Enviar',
          handler: data => {
            console.log('Recuperar contraseña enviado');
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

}
