import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  empresaTitulo: string;
  constructor() { 
    this.informationBody();
  }

  ngOnInit() {
    
  }

  informationBody(){
    this.empresaTitulo = "GOOD SERVICE"
  }
}
