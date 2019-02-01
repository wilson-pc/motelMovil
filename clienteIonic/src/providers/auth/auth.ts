import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { ListPage } from '../../pages/list/list';
import { LocalWeatherPage } from '../../pages/local-weather/local-weather';
import { RegisterRoomPage } from '../../pages/register-room/register-room';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
auxflag=0;
menus:any=[]



moteles = [
      
  { title: 'Lista de Reservas', component: ListPage },
  { title: 'Lista de Favoritos', component: ListPage },
  { title: 'Lista de Deseos', component: ListPage },
  { title: 'Billetera', component: LocalWeatherPage},
  { title: 'Reservar Habitacion(es)', component: RegisterRoomPage}
];

licorerias = [
  
  { title: 'Lista de Compras', component: ListPage },
  { title: 'Lista de Favoritos', component: ListPage },
  { title: 'Lista de Deseos', component: ListPage },
  { title: 'Billetera', component: LocalWeatherPage},
  { title: 'Reservar Bebida(s)', component: RegisterRoomPage}
];

sexshops = [
  
  { title: 'Lista de Compras', component: ListPage },
  { title: 'Lista de Favoritos', component: ListPage },
  { title: 'Lista de Deseos', component: ListPage },
  { title: 'Billetera', component: LocalWeatherPage},
  { title: 'Reservar Producto(s)', component: RegisterRoomPage}
];

mapas = [
  
  { title: 'Lugares cercanos', component: ListPage },
  { title: 'Lugares mas visitados', component: ListPage },
  { title: 'Lugares con puntuacion alta', component: ListPage },
  
];


  constructor(
    
  ){}
  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email,
      value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
  }
  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, 
      value.password)
      .then(
        res => resolve(res),
        err => reject(err))
    })
  }
  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
         // this.firebaseService.unsubscribeOnLogOut();
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }

}
