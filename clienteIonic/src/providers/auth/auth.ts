import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
auxflag=0;


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
