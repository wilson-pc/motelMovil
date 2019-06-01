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
import { SocketNegocioService3} from '../../services/socket-config.service';




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
  myPosition:any =[];
  img:string;
  
  markers: any[] = [];
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private googleMaps: GoogleMaps,
     private googlemarkers : SocketNegocioService3) {
  }

  ionViewDidLoad(){
    
    this.callMarkers();
    this.fillMarkers();
    this.loadMap();
    
    
    
    //this.getPosition();
  }
  fillMarkers()
  {
    this.googlemarkers.on('respuesta-listar-todos-negocio', async (data: { forEach: (arg0: (element: any) => void) => void; }) =>{
      await data.forEach((element: { nombre: any; direccion: { latitud: number; longitud: number; ubicacionFisica: any; }; foto: string; }) => {
        console.log(element.nombre);
        console.log(element.direccion.latitud);
        console.log(element.direccion.longitud);
        console.log(element.direccion.ubicacionFisica);
        this.markers.push({
          title: element.nombre,
          icon: this.createMarker(element.foto),
          position: {latitude : element.direccion.latitud,longitude: element.direccion.longitud},
          snippet:element.direccion.ubicacionFisica,
          draggable: false,
          
        });
      });
      
      
      
    });

  }
  callMarkers(){
    let data = "";
    this.googlemarkers.emit('listar-todos-negocio',data);
  }
  createMarker(urlicon: string)
  {
    let icon: MarkerIcon = {
      url: urlicon,
      size: {
        width: 48,
        height: 45
      }
    };
    return icon;
  }

  loadMap(){

    let mapOptions: GoogleMapOptions = {
      mapType: GoogleMapsMapTypeId.HYBRID,
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
      console.log(this.markers.toString());
      this.markers.forEach(marker=>{
        this.addMarker(marker);
      });
      this.map.refreshLayout();
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
      this.addMarker({
        title: 'YO',
        icon: this.createMarker('blue'),
        
        position: {latitude : response.latLng.lat, longitude: response.latLng.lng},
        snippet: '',
        draggable: false
      });
    })
    .catch(error =>{
      console.log(error);
    });
  }

  addMarker(options: { icon: MarkerIcon; position: { latitude: number; longitude: number; }; title: string; snippet: string; draggable: boolean; }){
    console.log("******************************************1");
    console.log(options.position.latitude);
    console.log(options.position.longitude);
    let markerOptions: MarkerOptions = {
      icon: options.icon,      
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
      animation: 'DROP',
    };
    if(markerOptions == undefined)
    {
      console.log("*******************************************************5");
    }
    console.log(markerOptions.title);
    console.log(markerOptions.position.lat);
    console.log(markerOptions.position.lng);
    console.log(markerOptions.snippet);
    this.map.addMarker(markerOptions);
    console.log("****************************************************2");
  }

 
}
