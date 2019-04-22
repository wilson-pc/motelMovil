import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Icon } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng,
  GoogleMapsMapTypeId,
  MarkerIcon
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
  icon: MarkerIcon = {
    url: '../../assets/imgs/crustaceos.png',
    size: {
      width: 32,
      height: 24
    }
  };
  markers: any[] = [
    { 
      position:{
        latitude: -17.3666745,
        longitude: -66.2387878,
      },
      title:'Point 1',
      snippet:"pop up de ejemplo 1",
      draggable:true
    },

    {
      
      position:{
        latitude: -17.3706884,
        longitude: -66.2397749,
      },
      title:'Point 2',
      snippet:"pop up de ejemplo 2",
      draggable:true
    },

    {
     
      position:{
        latitude: -17.391398,
        longitude: -66.2407904,
      },
      title:'Point 3',
      snippet:"pop up de ejemplo 3",
      draggable:true
    },
    
    {
     
      position:{
        latitude: -17.3878887,
        longitude: -66.223664,
      },
      title:'Point 4',
      snippet:"pop up de ejemplo 4",
      draggable:true
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
     
    })
    .catch(error =>{
      console.log(error);
    });
  }

  addMarker(options){
    let markerOptions: MarkerOptions = {
      icon:this.icon,
      
      position: new LatLng(options.position.latitude, options.position.longitude),
      title: options.title,
      styles: {
        'text-align': 'center',
        'font-style': 'italic',
        'font-weight': 'bold',
        'color': 'red'
      },
      snippet:options.snippet,
      draggable:options.draggable,
      
    };
    this.map.addMarker(markerOptions);
  }

 
}
