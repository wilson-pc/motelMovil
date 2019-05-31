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
//import { Geolocation } from '@ionic-native/geolocation/ngx';



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
  img:string = "data:image/jpeg;base64,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";
  icon: MarkerIcon = {
    url: this.img,
    size: {
      width: 48,
      height: 45
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
     private googleMaps: GoogleMaps,) {
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
        //'myLocation': true,   // (blue dot)
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
