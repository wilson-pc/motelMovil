import { Component, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../../models/Usuarios';

@Component({
  selector: 'app-registry-owner',
  templateUrl: './registry-owner.component.html',
  styleUrls: ['./registry-owner.component.css']
})
export class RegistryOwnerComponent implements OnInit {
  titulo: string;
	public isCollapsed = true;
	modal: NgbModalRef;
	closeResult: string;
   usuario:Usuarios;
	elements: any = [
		{ apellidos: 'Castillo Rosas', nombres: 'Carla', ci: '96854885', genero: "otro", contacto: "45685222", email: "servicio@gmail.com", }
		//user, pass
	];
	// Cabezeras de los elementos
	headElements = ['Nro', 'Nombres', 'Apellidos', 'CI', 'Genero', 'Contacto', 'Email'];

	constructor(private modalService: NgbModal) {
		this.titulo = "Usuarios Administradores";
		this.usuario=new Usuarios();
	}

	ngOnInit() { 
		// funcion para cargar datos en la lista
		this.getAdmin();
	}

	// ACCIONES DE LOS MODALS
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
