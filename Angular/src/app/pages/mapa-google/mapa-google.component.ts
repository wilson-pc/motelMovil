import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mapa-google',
  templateUrl: './mapa-google.component.html',
  styleUrls: ['./mapa-google.component.css']
})
export class MapaGoogleComponent implements OnInit {

  texto : string = 'Wenceslau Braz - Cuidado com as cargas';
  lat: number = -17.3957575;
  lng: number = -66.1460038;
  zoom: number = 15;

  constructor() { }

  ngOnInit() {
  }

}
