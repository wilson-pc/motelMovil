import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../../models/Usuarios';
import { Negocio } from '../../../models/Negocio';
import { getBase64, resizeBase64 } from 'base64js-es6';
import { UsuarioService } from '../../../services/usuario.service';
import * as CryptoJS from 'crypto-js';
import { clave } from '../../../cryptoclave';
import { SocketConfigService3 } from '../../../socket-config.service';
 
@Component({
  selector: 'app-form-comerce',
  templateUrl: './form-comerce.component.html',
  styleUrls: ['./form-comerce.component.css']
})
export class FormComerceComponent implements OnInit {

	titulo: string;
	ubicaciongps:string;
	descripcion:string;


	public isCollapsed = true;
	modal: NgbModalRef;
	closeResult: string;
	isError:boolean=false;
	isExito:boolean=false;
	isRequired:boolean=false;
	 negocios:Negocio;
	 
	elements: any = [
		{ negocio: 'Las tres hermanas', direccion: 'Av. Heroinas Nro 100', telefono: '96854885', titular: "Sir Angel", email: "servicio@gmail.com", }
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Nombre de Negocio', 'Direccion', 'Telefono', 'Titular', 'Email', 'Opciones'];
  constructor(private socket:SocketConfigService3,private modalService: NgbModal, private usuarioServ:UsuarioService) { 
    this.titulo = "Registrar Negocios";
		this.negocios=new Negocio;
		
	}
	
	changeListener($event): void {
    this.readThis($event.target);
	}
	
	readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    console.log(inputValue.files[0]);
    //this.docente.perfil = { tipo: inputValue.files[0].type, foto: ""};
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
		 // this.docente.perfil.foto = myReader.result.toString();
		// console.log(myReader.result.toString());
      resizeBase64(myReader.result, 400, 500).then((result) => {
				this.negocios.foto = result;	
				
       
      });
    }
		myReader.readAsDataURL(file);
		
  }

  ngOnInit() {
  }

  openFromRegistry(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	openModalView(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}
	openModalUpdate(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	openModalDelete(content) {
		this.modal = this.modalService.open(content, { centered: true, backdropClass: 'light-blue-backdrop' })    
    this.modal.result.then((e) => {
    });  
	}

	cancelModal() {
		this.modal.close();
	}

	// COSUMO DE SERVICIOS
	add(){

		console.log(this.descripcion);
		console.log(this.ubicaciongps);
		
		
		
			
		var date= new Date().toUTCString();
		this.isError=false;
		this.isRequired=false;
		this.isExito=false;		

		this.negocios.direccion={ubicaciongps:this.ubicaciongps,descripcion:this.descripcion};
		this.negocios.creacion={usuario:this.usuarioServ.usuarioActual.datos._id,fecha:date};
		this.negocios.modificacion={fecha:date,usuario:this.usuarioServ.usuarioActual.datos._id};

		
		let data={negocio:this.negocios}
		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data),clave.clave)
		this.socket.emit("registrar-negocio",ciphertext.toString());
		console.log(this.negocios);

	}

	update(){

	}

	delete(){

	}
	
	getAdmin(){

	}



}
