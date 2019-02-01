import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';

/**
 * Generated class for the DescripcionProductoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-descripcion-producto',
  templateUrl: 'descripcion-producto.html',
})
export class DescripcionProductoPage {
  character

  characters = [
    {
      name: 'Gollum',
      quote: 'Sneaky little hobbitses!',
      image: 'assets/img/avatar-gollum.jpg',
      items: [
        { title: 'Race', note: 'Hobbit' },
        { title: 'Culture', note: 'River Folk' },
        { title: 'Alter Ego', note: 'Smeagol' }
      ]
    },
    {
      name: 'Frodo',
      quote: 'Go back, Sam! I\'m going to Mordor alone!',
      image: 'assets/img/avatar-frodo.jpg',
      items: [
        { title: 'Race', note: 'Hobbit' },
        { title: 'Culture', note: 'Shire Folk' },
        { title: 'Weapon', note: 'Sting' }
      ]
    },
    {
      name: 'Samwise Gamgee',
      quote: 'What we need is a few good taters.',
      image: 'assets/img/avatar-samwise.jpg',
      items: [
        { title: 'Race', note: 'Hobbit' },
        { title: 'Culture', note: 'Shire Folk' },
        { title: 'Nickname', note: 'Sam' }
      ]
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams,public platform: Platform,public viewCtrl: ViewController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescripcionProductoPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
 
 // this.character = characters[this.params.get('charNum')];
  

}

