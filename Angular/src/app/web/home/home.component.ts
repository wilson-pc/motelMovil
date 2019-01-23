import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  empresaTitulo: string;

  images = [1, 2, 3, 4].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  
  constructor(private config: NgbCarouselConfig) { 
    this.informationBody();
    this.configCarousel(config);
  }

  ngOnInit() {
    
  }

  // Configuraciones del carousel
  configCarousel(config: any){
    // customize default values of carousels used by this component tree
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  informationBody(){
    this.empresaTitulo = "GOOD SERVICE"
  }
}
