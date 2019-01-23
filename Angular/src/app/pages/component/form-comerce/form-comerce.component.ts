import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../../models/Usuarios';

@Component({
  selector: 'app-form-comerce',
  templateUrl: './form-comerce.component.html',
  styleUrls: ['./form-comerce.component.css']
})
export class FormComerceComponent implements OnInit {

  titulo: string;
	public isCollapsed = true;
	modal: NgbModalRef;
	closeResult: string;
	isError:boolean=false;
	isExito:boolean=false;
	isRequired:boolean=false;
   usuario:Usuarios;
	elements: any = [
		{ negocio: 'Las tres hermanas', direccion: 'Av. Heroinas Nro 100', telefono: '96854885', titular: "Sir Angel", email: "servicio@gmail.com", }
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Nombre de Negocio', 'Direccion', 'Telefono', 'Titular', 'Email', 'Opciones'];
  constructor(private modalService: NgbModal) { 
    this.titulo = "Registrar Negocios";
		this.usuario=new Usuarios;
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

	}

	update(){

	}

	delete(){

	}
	
	getAdmin(){

	}


}
