import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { SocketConfigHomeService } from './../../socket-config.service';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../cryptoclave';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  empresaTitulo: string;

  datosContacto:any;
  isError: boolean = false;
	isExito: boolean = false;
	isRequired: boolean = false;
  images = [1, 2, 3, 4].map(() => `https://picsum.photos/900/500?random&t=${Math.random()}`);
  
  constructor(private config: NgbCarouselConfig,private socketHome:SocketConfigHomeService) { 
    this.informationBody();
    this.configCarousel(config);
  }

  ngOnInit() {
    
  }

  enviar(nombre,apellido,email,telefono,mensaje){
     var fecha=new Date().toUTCString();
    if(nombre && email && mensaje && this.validateEmail(email)){
      this.conn();
      let data = { mensaje:{nombre:nombre,apellido:apellido,email:email,mensaje:mensaje,fecha:fecha,telefono:telefono} }
      var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), clave.clave);
         this.socketHome.emit("enviar-contacto", ciphertext.toString());
    }
    else{
 this.isRequired=true;
    }
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
  conn(){
    this.respuestaEnivarContacto().subscribe((data:any)=>{
         if(data.error){
          this.isError=true;
         }
         else{
          this.isError=false;
          this.isExito=true;
         }
    });
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

  respuestaEnivarContacto() {
		let observable = new Observable(observer => {
			//respuesta-eliminar-usuario
			this.socketHome.on('respuesta-enviar-contacto', (data) => {
				observer.next(data);
			});
		})
		return observable;
	}
}
