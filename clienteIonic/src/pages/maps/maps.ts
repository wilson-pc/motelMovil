import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng,
  GoogleMapsMapTypeId
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation/ngx';



/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  map: GoogleMap;
  myPosition:any ={};
  markers: any[] = [
    {
      position:{
        latitude: -17.3666745,
        longitude: -66.2387878,
      },
      title:'Point 1',
      bindPopup:"<h1>Soy un popup NO SE SI FUNCIONARA</h1>"
    },
    {
      position:{
        latitude: -17.3706884,
        longitude: -66.2397749,
      },
      title:'Point 2'
    },
    {
      position:{
        latitude: -17.391398,
        longitude: -66.2407904,
      },
      title:'Point 3'
    },
    {
      position:{
        latitude: -17.3878887,
        longitude: -66.223664,
      },
      title:'Point 4'
    },
  ];
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private googleMaps: GoogleMaps,
     private geolocation:Geolocation) {
  }

  ionViewDidLoad(){
    this.loadMap();
    //this.getCurrentPosition();
  }

  loadMap(){

    let mapOptions: GoogleMapOptions = {
      mapType: GoogleMapsMapTypeId.TERRAIN,
      camera: {
        target: {
          lat: 43.0741904, // default location
          lng: -89.3809802 // default location
        },
        zoom: 18,
        tilt: 30,        
      },
      controls: {
        'compass': true,
        'myLocationButton': true,
        'myLocation': true,   // (blue dot)
        'indoorPicker': true,
        'zoom': true,          // android only
        'mapToolbar': true     // android only
      }
      // gestures: {
      //   scroll: true,
      //   tilt: true,
      //   zoom: true,
      //   rotate: true
      // },
      // preferences: {
      //   zoom: {
      //     minZoom: 0,
      //     maxZoom: 110,
      //   },
      //   building: false
      // },
      // styles: []
      
    };

    this.map = this.googleMaps.create('map_canvas', mapOptions);

    // Wait the MAP_READY before using any methods.
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      // Now you can use all methods safely.
      this.getPosition();
      //use to markers Options
     
      this.markers.forEach(marker=>{
        this.addMarker(marker);
      });

    })
    .catch(error =>{
      console.log(error);
    });

  }

  getPosition(): void{
    this.map.getMyLocation()
    .then(response => {
      this.map.moveCamera({
        target: response.latLng
      });
      this.map.addMarker({
        title: 'My Position',
        icon: 'blue',
        animation: 'DROP',
        position: response.latLng
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }

  addMarker(options){
    let markerOptions: MarkerOptions = {
      position: new LatLng(options.position.latitude, options.position.longitude),
      title: options.title
    };
    this.map.addMarker(markerOptions);
  }

 
}
