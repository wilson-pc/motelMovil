import {Component} from "@angular/core";
import {NavController, PopoverController} from "ionic-angular";
import {Storage} from '@ionic/storage';

import {NotificationsPage} from "../notifications/notifications";
import {SettingsPage} from "../settings/settings";
import {TripsPage} from "../trips/trips";
import {SearchLocationPage} from "../search-location/search-location";
import { LicoreriaPage } from "../licoreria/licoreria";
import { TopsPage } from "../tops/tops";
import { MotelPage } from "../motel/motel";
import { SexShopPage } from "../sex-shop/sex-shop";
import { CercaDeMiPage } from "../cerca-de-mi/cerca-de-mi";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  top: any;
  motel: any;
  bar: any;
  sexShop: any;
  map: any;

  

  constructor(private storage: Storage, public nav: NavController, public popoverCtrl: PopoverController) {
    // this.top = TopsPage;
    // this.motel = MotelPage;
    // this.bar = LicoreriaPage;
    // this.sexShop = SexShopPage;
    // this.map = CercaDeMiPage;
  }

  // search condition
  public search = {
    name: "Rio de Janeiro, Brazil",
    date: new Date().toISOString()
  }


  ionViewWillEnter() {
    // this.search.pickup = "Rio de Janeiro, Brazil";
    // this.search.dropOff = "Same as pickup";
    this.storage.get('pickup').then((val) => {
      if (val === null) {
        this.search.name = "Rio de Janeiro, Brazil"
      } else {
        this.search.name = val;
      }
    }).catch((err) => {
      console.log(err)
    });
  }

  // go to result page
  doSearch() {
    this.nav.push(TripsPage);
  }

  // choose place
  choosePlace(from) {
    this.nav.push(SearchLocationPage, from);
  }

  // to go account page
  goToAccount() {
    this.nav.push(SettingsPage);
  }

  presentNotifications(myEvent) {
    console.log(myEvent);
    let popover = this.popoverCtrl.create(NotificationsPage);
    popover.present({
      ev: myEvent
    });
  }

}

//
